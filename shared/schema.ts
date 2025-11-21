import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameFa: text("name_fa").notNull(), // Persian name
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionFa: text("description_fa"), // Persian description
  image: text("image"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => categories.id),
  name: text("name").notNull(),
  nameFa: text("name_fa").notNull(), // Persian name
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionFa: text("description_fa"), // Persian description
  specifications: jsonb("specifications"), // JSON for specs
  images: text().array(), // Array of image URLs
  thumbnail: text("thumbnail"),
  basePrice: decimal("base_price", { precision: 10, scale: 0 }).notNull(), // Price in Toman
  stock: integer("stock").default(0),
  isNew: boolean("is_new").default(false),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  views: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Product variations (for different storage/color options)
export const productVariations = pgTable("product_variations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  storage: text("storage"), // e.g., "128GB", "256GB"
  color: text("color"),
  colorFa: text("color_fa"), // Persian color name
  colorHex: text("color_hex"), // Color hex code
  price: decimal("price", { precision: 10, scale: 0 }).notNull(), // Price in Toman
  stock: integer("stock").default(0),
  sku: text("sku").unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductVariationSchema = createInsertSchema(productVariations).omit({
  id: true,
  createdAt: true,
});

export type InsertProductVariation = z.infer<typeof insertProductVariationSchema>;
export type ProductVariation = typeof productVariations.$inferSelect;

// Used iPhones table
export const usedPhones = pgTable("used_phones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  model: text("model"),
  modelFa: text("model_fa"),
  storage: text("storage"),
  color: text("color"),
  colorFa: text("color_fa"),
  condition: text("condition").default("excellent"),
  conditionFa: text("condition_fa").default("عالی"),
  batteryHealth: integer("battery_health"),
  price: decimal("price", { precision: 10, scale: 0 }).notNull(),
  images: text().array(),
  description: text("description"),
  descriptionFa: text("description_fa"),
  sellerName: text("seller_name"),
  sellerPhone: text("seller_phone"),
  isApproved: boolean("is_approved").default(false),
  isSold: boolean("is_sold").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUsedPhoneSchema = createInsertSchema(usedPhones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUsedPhone = z.infer<typeof insertUsedPhoneSchema>;
export type UsedPhone = typeof usedPhones.$inferSelect;

// Prices history table (for tracking price changes)
export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  variationId: varchar("variation_id").references(() => productVariations.id),
  oldPrice: decimal("old_price", { precision: 10, scale: 0 }),
  newPrice: decimal("new_price", { precision: 10, scale: 0 }).notNull(),
  reason: text("reason"),
  changedBy: varchar("changed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;
export type PriceHistory = typeof priceHistory.$inferSelect;

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 0 }).notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  shippingAddress: text("shipping_address").notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 0 }).default("0"),
  notes: text("notes"),
  paymentMethod: text("payment_method"), // card, cash, installment
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id),
  variationId: varchar("variation_id").references(() => productVariations.id),
  productName: text("product_name").notNull(),
  productNameFa: text("product_name_fa").notNull(),
  variation: text("variation"),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 0 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 0 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Cart table (for persistent shopping cart)
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: text("session_id"), // For non-logged-in users
  productId: varchar("product_id").references(() => products.id).notNull(),
  variationId: varchar("variation_id").references(() => productVariations.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Page visits table (for analytics)
export const visits = pgTable("visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  page: text("page").notNull(),
  path: text("path").notNull(),
  userAgent: text("user_agent"),
  ip: text("ip"),
  referrer: text("referrer"),
  sessionId: text("session_id"),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
  createdAt: true,
});

export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = typeof visits.$inferSelect;

// AI Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: text("session_id"),
  role: text("role").notNull(), // user, assistant
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Error logs table (for monitoring and debugging)
export const errorLogs = pgTable("error_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(), // frontend, backend, api
  errorType: text("error_type").notNull(), // TypeError, Error, etc.
  message: text("message").notNull(),
  stack: text("stack"),
  url: text("url"),
  userAgent: text("user_agent"),
  userId: varchar("user_id").references(() => users.id),
  sessionId: text("session_id"),
  severity: text("severity").notNull().default("error"), // error, warning, critical
  metadata: jsonb("metadata"), // Additional context
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertErrorLogSchema = createInsertSchema(errorLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertErrorLog = z.infer<typeof insertErrorLogSchema>;
export type ErrorLog = typeof errorLogs.$inferSelect;

// WhatsApp Orders table (for customer orders via WhatsApp)
export const whatsappOrders = pgTable("whatsapp_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(), // WhatsApp number
  productName: text("product_name").notNull(),
  productNameFa: text("product_name_fa"),
  productDetails: text("product_details"), // Storage, color, etc.
  message: text("message"), // Customer's message
  status: text("status").notNull().default("pending"), // pending, contacted, completed, cancelled
  adminNotes: text("admin_notes"), // Admin's notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWhatsappOrderSchema = createInsertSchema(whatsappOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWhatsappOrder = z.infer<typeof insertWhatsappOrderSchema>;
export type WhatsappOrder = typeof whatsappOrders.$inferSelect;

// Product Models table (iPhone 15, iPad Air, etc.)
export const productModels = pgTable("product_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
  name: text("name").notNull(),
  nameFa: text("name_fa").notNull(),
  generation: text("generation"), // iPhone 15, iPhone 16, etc.
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductModelSchema = createInsertSchema(productModels).omit({
  id: true,
  createdAt: true,
});

export type InsertProductModel = z.infer<typeof insertProductModelSchema>;
export type ProductModel = typeof productModels.$inferSelect;

// Product Colors table
export const productColors = pgTable("product_colors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameFa: text("name_fa").notNull(),
  hexCode: text("hex_code").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductColorSchema = createInsertSchema(productColors).omit({
  id: true,
  createdAt: true,
});

export type InsertProductColor = z.infer<typeof insertProductColorSchema>;
export type ProductColor = typeof productColors.$inferSelect;

// Product Storage Options table
export const productStorageOptions = pgTable("product_storage_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 128GB, 256GB, etc.
  nameFa: text("name_fa").notNull(),
  categoryId: varchar("category_id").references(() => categories.id), // Optional: specific to category
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductStorageOptionSchema = createInsertSchema(productStorageOptions).omit({
  id: true,
  createdAt: true,
});

export type InsertProductStorageOption = z.infer<typeof insertProductStorageOptionSchema>;
export type ProductStorageOption = typeof productStorageOptions.$inferSelect;

// Product Prices table (combination of model + storage + color)
export const productPrices = pgTable("product_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelId: varchar("model_id").references(() => productModels.id).notNull(),
  storageId: varchar("storage_id").references(() => productStorageOptions.id).notNull(),
  colorId: varchar("color_id").references(() => productColors.id).notNull(),
  price: decimal("price", { precision: 10, scale: 0 }).notNull(), // Price in Toman
  stock: integer("stock").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductPriceSchema = createInsertSchema(productPrices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProductPrice = z.infer<typeof insertProductPriceSchema>;
export type ProductPrice = typeof productPrices.$inferSelect;

// Apple ID Manager table
export const appleIdOrders = pgTable("apple_id_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(), // Customer phone number
  email: text("email"), // Optional customer email
  birthday: text("birthday").notNull(), // Shamsi/Jalali format from user (YYYY/MM/DD)
  birthdayGregorian: text("birthday_gregorian"), // Auto-converted Gregorian format
  country: text("country").notNull().default("Iran"),
  securityQuestion1: text("security_question_1"), // Auto-generated
  securityAnswer1: text("security_answer_1"), // Auto-generated
  securityQuestion2: text("security_question_2"), // Auto-generated
  securityAnswer2: text("security_answer_2"), // Auto-generated
  securityQuestion3: text("security_question_3"), // Auto-generated
  securityAnswer3: text("security_answer_3"), // Auto-generated
  generatedPassword: text("generated_password"), // Auto-generated password (medium strength)
  paymentReceipt: text("payment_receipt"), // URL to uploaded payment receipt
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 0 }), // Payment amount in Toman
  status: text("status").notNull().default("pending_payment"), // pending_payment, payment_received, processing, completed, rejected
  accountEmail: text("account_email"), // Final Apple ID email (filled by admin)
  accountPassword: text("account_password"), // Final Apple ID password (filled by admin)
  adminNotes: text("admin_notes"), // Admin notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAppleIdOrderSchema = createInsertSchema(appleIdOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAppleIdOrder = z.infer<typeof insertAppleIdOrderSchema>;
export type AppleIdOrder = typeof appleIdOrders.$inferSelect;