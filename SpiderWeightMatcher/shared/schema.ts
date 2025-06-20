import { pgTable, text, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
  teamColor: varchar("team_color", { length: 20 }).notNull(),
  weight: integer("weight").notNull(),
  isPriority: integer("is_priority").default(0).notNull(), // 0 = normal, 1 = priority
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  fightNumber: integer("fight_number").notNull(),
  fighter1Id: integer("fighter1_id").notNull(),
  fighter2Id: integer("fighter2_id").notNull(),
  weightClass: integer("weight_class").notNull(),
  matchType: varchar("match_type", { length: 20 }).notNull(), // "exact" or "tolerance"
});

export const insertEntrySchema = createInsertSchema(entries).omit({
  id: true,
}).extend({
  name: z.string().min(1, "Fighter name is required").max(20, "Fighter name must be 20 characters or less"),
  weight: z.number().min(100, "Weight must be exactly 3 digits (100-999)").max(999, "Weight must be exactly 3 digits (100-999)"),
  isPriority: z.number().min(0).max(1).default(0),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

export type InsertEntry = z.infer<typeof insertEntrySchema>;
export type Entry = typeof entries.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type MatchWithFighters = Match & {
  fighter1: Entry;
  fighter2: Entry;
};
