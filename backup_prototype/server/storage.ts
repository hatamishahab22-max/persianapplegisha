import { type Order, type InsertOrder, orders } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createOrder(order: InsertOrder): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }
}

export const storage = new DatabaseStorage();
