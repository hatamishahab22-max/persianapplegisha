import { eq, desc, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  users, categories, products, productVariations, usedPhones, visits, errorLogs, whatsappOrders,
  productModels, productColors, productStorageOptions, productPrices, appleIdOrders,
  type User, type InsertUser, 
  type UsedPhone, type InsertUsedPhone,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type ProductVariation, type InsertProductVariation,
  type Visit, type InsertVisit,
  type ErrorLog, type InsertErrorLog,
  type WhatsappOrder, type InsertWhatsappOrder,
  type ProductModel, type InsertProductModel,
  type ProductColor, type InsertProductColor,
  type ProductStorageOption, type InsertProductStorageOption,
  type ProductPrice, type InsertProductPrice,
  type AppleIdOrder, type InsertAppleIdOrder
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Product Variation methods
  async getAllVariations(): Promise<ProductVariation[]> {
    return await db.select().from(productVariations);
  }

  async getVariation(id: string): Promise<ProductVariation | undefined> {
    const result = await db.select().from(productVariations).where(eq(productVariations.id, id));
    return result[0];
  }

  async getVariationsByProduct(productId: string): Promise<ProductVariation[]> {
    return await db.select().from(productVariations).where(eq(productVariations.productId, productId));
  }

  async createVariation(variation: InsertProductVariation): Promise<ProductVariation> {
    const result = await db.insert(productVariations).values(variation).returning();
    return result[0];
  }

  async updateVariation(id: string, updates: Partial<InsertProductVariation>): Promise<ProductVariation | undefined> {
    const result = await db.update(productVariations)
      .set(updates)
      .where(eq(productVariations.id, id))
      .returning();
    return result[0];
  }

  async deleteVariation(id: string): Promise<boolean> {
    const result = await db.delete(productVariations).where(eq(productVariations.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async bulkUpdatePrices(updates: Array<{ id: string; price: string }>): Promise<number> {
    let count = 0;
    for (const update of updates) {
      const result = await db.update(productVariations)
        .set({ price: update.price })
        .where(eq(productVariations.id, update.id));
      if (result.rowCount) count += result.rowCount;
    }
    return count;
  }

  // Used phones methods
  async getAllUsedPhones(): Promise<UsedPhone[]> {
    return await db.select().from(usedPhones).orderBy(desc(usedPhones.createdAt));
  }

  async getUsedPhone(id: string): Promise<UsedPhone | undefined> {
    const result = await db.select().from(usedPhones).where(eq(usedPhones.id, id));
    return result[0];
  }

  async createUsedPhone(phone: InsertUsedPhone): Promise<UsedPhone> {
    const result = await db.insert(usedPhones).values(phone).returning();
    return result[0];
  }

  async updateUsedPhone(id: string, updates: Partial<InsertUsedPhone>): Promise<UsedPhone | undefined> {
    const result = await db.update(usedPhones)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(usedPhones.id, id))
      .returning();
    return result[0];
  }

  async deleteUsedPhone(id: string): Promise<boolean> {
    const result = await db.delete(usedPhones).where(eq(usedPhones.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Visit/Analytics methods
  async createVisit(visit: InsertVisit): Promise<Visit> {
    const result = await db.insert(visits).values(visit).returning();
    return result[0];
  }

  async getVisitsStats(): Promise<any> {
    const totalVisits = await db.select({ count: sql<number>`count(*)` }).from(visits);
    const uniqueVisitors = await db.select({ count: sql<number>`count(distinct ${visits.sessionId})` }).from(visits);
    return {
      total: totalVisits[0]?.count || 0,
      unique: uniqueVisitors[0]?.count || 0
    };
  }

  async getPopularPages(): Promise<any[]> {
    const popularPages = await db
      .select({
        page: visits.page,
        count: sql<number>`count(*)`.as('count')
      })
      .from(visits)
      .groupBy(visits.page)
      .orderBy(desc(sql`count(*)`))
      .limit(10);
    return popularPages;
  }

  // Error Logging methods
  async createErrorLog(error: InsertErrorLog): Promise<ErrorLog> {
    const result = await db.insert(errorLogs).values(error).returning();
    return result[0];
  }

  async getErrorLogs(filters?: { resolved?: boolean; severity?: string; limit?: number }): Promise<ErrorLog[]> {
    let query = db.select().from(errorLogs);
    
    if (filters?.resolved !== undefined) {
      query = query.where(eq(errorLogs.resolved, filters.resolved)) as any;
    }
    if (filters?.severity) {
      query = query.where(eq(errorLogs.severity, filters.severity)) as any;
    }
    
    query = query.orderBy(desc(errorLogs.createdAt)) as any;
    
    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }
    
    return await query;
  }

  async getErrorStats(): Promise<any> {
    const totalErrors = await db.select({ count: sql<number>`count(*)` }).from(errorLogs);
    const unresolvedErrors = await db.select({ count: sql<number>`count(*)` })
      .from(errorLogs)
      .where(eq(errorLogs.resolved, false));
    return {
      total: totalErrors[0]?.count || 0,
      unresolved: unresolvedErrors[0]?.count || 0
    };
  }

  async markErrorResolved(id: string): Promise<boolean> {
    const result = await db.update(errorLogs)
      .set({ resolved: true })
      .where(eq(errorLogs.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // WhatsApp Orders methods
  async getAllWhatsappOrders(): Promise<WhatsappOrder[]> {
    return await db.select().from(whatsappOrders).orderBy(desc(whatsappOrders.createdAt));
  }

  async getWhatsappOrder(id: string): Promise<WhatsappOrder | undefined> {
    const result = await db.select().from(whatsappOrders).where(eq(whatsappOrders.id, id));
    return result[0];
  }

  async createWhatsappOrder(order: InsertWhatsappOrder): Promise<WhatsappOrder> {
    const result = await db.insert(whatsappOrders).values(order).returning();
    return result[0];
  }

  async updateWhatsappOrder(id: string, updates: Partial<InsertWhatsappOrder>): Promise<WhatsappOrder | undefined> {
    const result = await db.update(whatsappOrders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(whatsappOrders.id, id))
      .returning();
    return result[0];
  }

  async deleteWhatsappOrder(id: string): Promise<boolean> {
    const result = await db.delete(whatsappOrders).where(eq(whatsappOrders.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Product Models methods
  async getAllModels(): Promise<ProductModel[]> {
    return await db.select().from(productModels).orderBy(productModels.order);
  }

  async getModel(id: string): Promise<ProductModel | undefined> {
    const result = await db.select().from(productModels).where(eq(productModels.id, id));
    return result[0];
  }

  async createModel(model: InsertProductModel): Promise<ProductModel> {
    const result = await db.insert(productModels).values(model).returning();
    return result[0];
  }

  async updateModel(id: string, updates: Partial<InsertProductModel>): Promise<ProductModel | undefined> {
    const result = await db.update(productModels)
      .set(updates)
      .where(eq(productModels.id, id))
      .returning();
    return result[0];
  }

  async deleteModel(id: string): Promise<boolean> {
    const result = await db.delete(productModels).where(eq(productModels.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Product Colors methods
  async getAllColors(): Promise<ProductColor[]> {
    return await db.select().from(productColors).orderBy(productColors.order);
  }

  async getColor(id: string): Promise<ProductColor | undefined> {
    const result = await db.select().from(productColors).where(eq(productColors.id, id));
    return result[0];
  }

  async createColor(color: InsertProductColor): Promise<ProductColor> {
    const result = await db.insert(productColors).values(color).returning();
    return result[0];
  }

  async updateColor(id: string, updates: Partial<InsertProductColor>): Promise<ProductColor | undefined> {
    const result = await db.update(productColors)
      .set(updates)
      .where(eq(productColors.id, id))
      .returning();
    return result[0];
  }

  async deleteColor(id: string): Promise<boolean> {
    const result = await db.delete(productColors).where(eq(productColors.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Product Storage Options methods
  async getAllStorageOptions(): Promise<ProductStorageOption[]> {
    return await db.select().from(productStorageOptions).orderBy(productStorageOptions.order);
  }

  async getStorageOption(id: string): Promise<ProductStorageOption | undefined> {
    const result = await db.select().from(productStorageOptions).where(eq(productStorageOptions.id, id));
    return result[0];
  }

  async createStorageOption(option: InsertProductStorageOption): Promise<ProductStorageOption> {
    const result = await db.insert(productStorageOptions).values(option).returning();
    return result[0];
  }

  async updateStorageOption(id: string, updates: Partial<InsertProductStorageOption>): Promise<ProductStorageOption | undefined> {
    const result = await db.update(productStorageOptions)
      .set(updates)
      .where(eq(productStorageOptions.id, id))
      .returning();
    return result[0];
  }

  async deleteStorageOption(id: string): Promise<boolean> {
    const result = await db.delete(productStorageOptions).where(eq(productStorageOptions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Product Prices methods
  async getAllProductPrices(): Promise<any[]> {
    const prices = await db
      .select({
        id: productPrices.id,
        modelId: productPrices.modelId,
        colorId: productPrices.colorId,
        storageId: productPrices.storageId,
        price: productPrices.price,
        stock: productPrices.stock,
        isActive: productPrices.isActive,
        createdAt: productPrices.createdAt,
        updatedAt: productPrices.updatedAt,
        model: {
          id: productModels.id,
          name: productModels.name,
          nameFa: productModels.nameFa,
          generation: productModels.generation,
          categoryId: productModels.categoryId,
        },
        color: {
          id: productColors.id,
          name: productColors.name,
          nameFa: productColors.nameFa,
          hexCode: productColors.hexCode,
        },
        storage: {
          id: productStorageOptions.id,
          name: productStorageOptions.name,
          nameFa: productStorageOptions.nameFa,
        },
      })
      .from(productPrices)
      .leftJoin(productModels, eq(productPrices.modelId, productModels.id))
      .leftJoin(productColors, eq(productPrices.colorId, productColors.id))
      .leftJoin(productStorageOptions, eq(productPrices.storageId, productStorageOptions.id));
    
    // Now fetch categories for each model
    const enrichedPrices = await Promise.all(
      prices.map(async (price) => {
        if (price.model?.categoryId) {
          const category = await this.getCategory(price.model.categoryId);
          return {
            ...price,
            model: {
              ...price.model,
              category: category || null,
            },
          };
        }
        return {
          ...price,
          model: {
            ...price.model,
            category: null,
          },
        };
      })
    );
    
    return enrichedPrices;
  }

  async getProductPrice(id: string): Promise<ProductPrice | undefined> {
    const result = await db.select().from(productPrices).where(eq(productPrices.id, id));
    return result[0];
  }

  async createProductPrice(price: InsertProductPrice): Promise<ProductPrice> {
    const result = await db.insert(productPrices).values(price).returning();
    return result[0];
  }

  async updateProductPrice(id: string, updates: Partial<InsertProductPrice>): Promise<ProductPrice | undefined> {
    const result = await db.update(productPrices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(productPrices.id, id))
      .returning();
    return result[0];
  }

  async deleteProductPrice(id: string): Promise<boolean> {
    const result = await db.delete(productPrices).where(eq(productPrices.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getProductDetails(modelName: string): Promise<{
    model: ProductModel | null;
    category: Category | null;
    storageOptions: ProductStorageOption[];
    colors: ProductColor[];
    prices: Array<{
      storageId: string;
      storageName: string;
      colorId: string;
      colorName: string;
      colorHex: string;
      price: string;
      stock: number;
    }>;
  }> {
    // First, find the model by name (nameFa or name)
    const models = await db.select().from(productModels).where(
      or(
        eq(productModels.nameFa, modelName),
        eq(productModels.name, modelName)
      )
    );
    
    const model = models[0];
    
    if (!model) {
      return {
        model: null,
        category: null,
        storageOptions: [],
        colors: [],
        prices: []
      };
    }

    // Get the category
    const category = model.categoryId ? await this.getCategory(model.categoryId) : null;

    // Get all prices for this model with joins
    const pricesData = await db
      .select({
        storageId: productStorageOptions.id,
        storageName: productStorageOptions.nameFa,
        colorId: productColors.id,
        colorName: productColors.nameFa,
        colorHex: productColors.hexCode,
        price: productPrices.price,
        stock: productPrices.stock,
      })
      .from(productPrices)
      .leftJoin(productStorageOptions, eq(productPrices.storageId, productStorageOptions.id))
      .leftJoin(productColors, eq(productPrices.colorId, productColors.id))
      .where(eq(productPrices.modelId, model.id));

    // Get unique storage options and colors
    const storageIds = new Set<string>();
    const colorIds = new Set<string>();
    const prices = pricesData
      .filter(p => p.storageId && p.colorId)
      .map(p => {
        storageIds.add(p.storageId!);
        colorIds.add(p.colorId!);
        return {
          storageId: p.storageId!,
          storageName: p.storageName || '',
          colorId: p.colorId!,
          colorName: p.colorName || '',
          colorHex: p.colorHex || '#000000',
          price: p.price || '0',
          stock: p.stock || 0,
        };
      });

    // Fetch unique storage options
    const storageOptions = await db
      .select()
      .from(productStorageOptions)
      .where(
        sql`${productStorageOptions.id} = ANY(${Array.from(storageIds)})`
      );

    // Fetch unique colors
    const colors = await db
      .select()
      .from(productColors)
      .where(
        sql`${productColors.id} = ANY(${Array.from(colorIds)})`
      );

    return {
      model,
      category: category || null,
      storageOptions,
      colors,
      prices
    };
  }

  // Apple ID Order methods
  async getAllAppleIdOrders(): Promise<AppleIdOrder[]> {
    return await db.select().from(appleIdOrders).orderBy(desc(appleIdOrders.createdAt));
  }

  async getAppleIdOrder(id: string): Promise<AppleIdOrder | undefined> {
    const result = await db.select().from(appleIdOrders).where(eq(appleIdOrders.id, id));
    return result[0];
  }

  async createAppleIdOrder(order: InsertAppleIdOrder): Promise<AppleIdOrder> {
    const result = await db.insert(appleIdOrders).values(order).returning();
    return result[0];
  }

  async updateAppleIdOrder(id: string, updates: Partial<InsertAppleIdOrder>): Promise<AppleIdOrder | undefined> {
    const result = await db.update(appleIdOrders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(appleIdOrders.id, id))
      .returning();
    return result[0];
  }

  async deleteAppleIdOrder(id: string): Promise<boolean> {
    const result = await db.delete(appleIdOrders).where(eq(appleIdOrders.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
