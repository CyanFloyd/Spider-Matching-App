import { entries, matches, type Entry, type InsertEntry, type Match, type InsertMatch, type MatchWithFighters } from "@shared/schema";

export interface IStorage {
  // Entry operations
  getEntries(): Promise<Entry[]>;
  createEntry(entry: InsertEntry): Promise<Entry>;
  deleteEntry(id: number): Promise<void>;
  clearEntries(): Promise<void>;
  
  // Match operations
  getMatches(): Promise<MatchWithFighters[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  clearMatches(): Promise<void>;
}

export class MemStorage implements IStorage {
  private entries: Map<number, Entry>;
  private matches: Map<number, Match>;
  private currentEntryId: number;
  private currentMatchId: number;

  constructor() {
    this.entries = new Map();
    this.matches = new Map();
    this.currentEntryId = 1;
    this.currentMatchId = 1;
  }

  async getEntries(): Promise<Entry[]> {
    return Array.from(this.entries.values());
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const id = this.currentEntryId++;
    const entry: Entry = { ...insertEntry, id, isPriority: insertEntry.isPriority || 0 };
    this.entries.set(id, entry);
    return entry;
  }

  async deleteEntry(id: number): Promise<void> {
    this.entries.delete(id);
  }

  async clearEntries(): Promise<void> {
    this.entries.clear();
    this.currentEntryId = 1;
  }

  async getMatches(): Promise<MatchWithFighters[]> {
    const matchesArray = Array.from(this.matches.values());
    const matchesWithFighters: MatchWithFighters[] = [];

    for (const match of matchesArray) {
      const fighter1 = this.entries.get(match.fighter1Id);
      const fighter2 = this.entries.get(match.fighter2Id);
      
      if (fighter1 && fighter2) {
        matchesWithFighters.push({
          ...match,
          fighter1,
          fighter2,
        });
      }
    }

    return matchesWithFighters;
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const match: Match = { ...insertMatch, id };
    this.matches.set(id, match);
    return match;
  }

  async clearMatches(): Promise<void> {
    this.matches.clear();
    this.currentMatchId = 1;
  }
}

export const storage = new MemStorage();
