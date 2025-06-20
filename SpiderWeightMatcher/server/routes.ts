import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEntrySchema, insertMatchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all entries
  app.get("/api/entries", async (req, res) => {
    try {
      const entries = await storage.getEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Create new entry
  app.post("/api/entries", async (req, res) => {
    try {
      const validatedData = insertEntrySchema.parse(req.body);
      const entry = await storage.createEntry(validatedData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid entry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create entry" });
      }
    }
  });

  // Delete entry
  app.delete("/api/entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEntry(id);
      res.json({ message: "Entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  // Clear all entries
  app.delete("/api/entries", async (req, res) => {
    try {
      await storage.clearEntries();
      res.json({ message: "All entries cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear entries" });
    }
  });

  // Get all matches
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Process matches
  app.post("/api/matches/process", async (req, res) => {
    try {
      const entries = await storage.getEntries();
      
      // Clear existing matches
      await storage.clearMatches();
      
      // Sort entries by priority first, then by weight
      const sortedEntries = [...entries].sort((a, b) => {
        // Priority entries first
        if (a.isPriority !== b.isPriority) {
          return b.isPriority - a.isPriority;
        }
        // Then sort by weight
        return a.weight - b.weight;
      });
      
      // Track fighter matchup counts (max 2 per fighter)
      const fighterMatchCounts = new Map<number, number>();
      let fightNumber = 1;
      
      // Initialize match counts
      sortedEntries.forEach(entry => {
        fighterMatchCounts.set(entry.id, 0);
      });
      
      // Process multiple rounds to ensure better distribution
      let matchesCreated = true;
      while (matchesCreated) {
        matchesCreated = false;
        
        for (let i = 0; i < sortedEntries.length; i++) {
          const fighter1 = sortedEntries[i];
          
          // Skip if fighter already has 2 matches
          if (fighterMatchCounts.get(fighter1.id)! >= 2) continue;
          
          let bestMatch = null;
          let bestMatchScore = -1;
          
          // Look for best match considering exact weight, tolerance, and team diversity
          for (let j = 0; j < sortedEntries.length; j++) {
            if (i === j) continue;
            
            const fighter2 = sortedEntries[j];
            
            // Skip if fighter already has 2 matches
            if (fighterMatchCounts.get(fighter2.id)! >= 2) continue;
            
            // Skip same team
            if (fighter1.teamColor === fighter2.teamColor) continue;
            
            // Calculate weight difference
            const weightDiff = Math.abs(fighter1.weight - fighter2.weight);
            
            // Only consider matches within tolerance (±3)
            if (weightDiff > 3) continue;
            
            // Score the match (lower is better)
            let score = weightDiff;
            
            // Prefer fighters with fewer existing matches
            const fighter1Matches = fighterMatchCounts.get(fighter1.id)!;
            const fighter2Matches = fighterMatchCounts.get(fighter2.id)!;
            score += (fighter1Matches + fighter2Matches) * 10; // Heavily weight match distribution
            
            // Priority bet fighters get massive bonus for best matches
            if (fighter1.isPriority === 1 || fighter2.isPriority === 1) {
              score -= 200; // Huge priority bonus
              // Give extra priority for exact weight matches with priority bets
              if (weightDiff === 0) {
                score -= 500; // Massive bonus for exact priority matches
              }
            }
            
            // Exact weight matches get priority
            if (weightDiff === 0) {
              score -= 100; // Huge bonus for exact matches
            }
            
            // Select best match
            if (bestMatchScore === -1 || score < bestMatchScore) {
              bestMatch = fighter2;
              bestMatchScore = score;
            }
          }
          
          // Create match if found
          if (bestMatch) {
            const matchType = fighter1.weight === bestMatch.weight ? "exact" : "tolerance";
            const weightClass = Math.max(fighter1.weight, bestMatch.weight);
            
            await storage.createMatch({
              fightNumber,
              fighter1Id: fighter1.id,
              fighter2Id: bestMatch.id,
              weightClass,
              matchType,
            });
            
            // Update match counts
            fighterMatchCounts.set(fighter1.id, fighterMatchCounts.get(fighter1.id)! + 1);
            fighterMatchCounts.set(bestMatch.id, fighterMatchCounts.get(bestMatch.id)! + 1);
            fightNumber++;
            matchesCreated = true;
          }
        }
      }
      
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to process matches" });
    }
  });

  // Clear all matches
  app.delete("/api/matches", async (req, res) => {
    try {
      await storage.clearMatches();
      res.json({ message: "All matches cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear matches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
