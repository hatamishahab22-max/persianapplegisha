import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  birthYear: integer("birth_year").notNull(),
  birthMonth: integer("birth_month").notNull(),
  birthDay: integer("birth_day").notNull(),
  email: text("email"),
  status: text("status").default("pending").notNull(), // pending, completed, cancelled
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  firstName: true,
  lastName: true,
  whatsapp: true,
  birthYear: true,
  birthMonth: true,
  birthDay: true,
  email: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
