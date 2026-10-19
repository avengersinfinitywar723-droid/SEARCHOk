import { pgTable, serial, text, integer, bigint, timestamp } from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default("").notNull(),
  // "file" = uploaded to server, "link" = external URL (YouTube / direct mp4)
  sourceType: text("source_type").notNull().default("file"),
  // stored filename on disk (for file) or the external URL (for link)
  source: text("source").notNull(),
  mimeType: text("mime_type").default("video/mp4").notNull(),
  size: bigint("size", { mode: "number" }).default(0).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
