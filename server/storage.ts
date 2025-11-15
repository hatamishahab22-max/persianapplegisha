import { 
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
  type ProductPrice, type InsertProductPrice
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Product Variation methods
  getAllVariations(): Promise<ProductVariation[]>;
  getVariation(id: string): Promise<ProductVariation | undefined>;
  getVariationsByProduct(productId: string): Promise<ProductVariation[]>;
  createVariation(variation: InsertProductVariation): Promise<ProductVariation>;
  updateVariation(id: string, variation: Partial<InsertProductVariation>): Promise<ProductVariation | undefined>;
  deleteVariation(id: string): Promise<boolean>;
  bulkUpdatePrices(updates: Array<{ id: string; price: string }>): Promise<number>;
  
  // Used phones methods
  getAllUsedPhones(): Promise<UsedPhone[]>;
  getUsedPhone(id: string): Promise<UsedPhone | undefined>;
  createUsedPhone(phone: InsertUsedPhone): Promise<UsedPhone>;
  updateUsedPhone(id: string, phone: Partial<InsertUsedPhone>): Promise<UsedPhone | undefined>;
  deleteUsedPhone(id: string): Promise<boolean>;
  
  // Visit/Analytics methods
  createVisit(visit: InsertVisit): Promise<Visit>;
  getVisitsStats(): Promise<any>;
  getPopularPages(): Promise<any[]>;
  
  // Error Logging methods
  createErrorLog(error: InsertErrorLog): Promise<ErrorLog>;
  getErrorLogs(filters?: { resolved?: boolean; severity?: string; limit?: number }): Promise<ErrorLog[]>;
  getErrorStats(): Promise<any>;
  markErrorResolved(id: string): Promise<boolean>;
  
  // WhatsApp Orders methods
  getAllWhatsappOrders(): Promise<WhatsappOrder[]>;
  getWhatsappOrder(id: string): Promise<WhatsappOrder | undefined>;
  createWhatsappOrder(order: InsertWhatsappOrder): Promise<WhatsappOrder>;
  updateWhatsappOrder(id: string, order: Partial<InsertWhatsappOrder>): Promise<WhatsappOrder | undefined>;
  deleteWhatsappOrder(id: string): Promise<boolean>;
  
  // Product Models methods
  getAllModels(): Promise<ProductModel[]>;
  getModel(id: string): Promise<ProductModel | undefined>;
  createModel(model: InsertProductModel): Promise<ProductModel>;
  updateModel(id: string, model: Partial<InsertProductModel>): Promise<ProductModel | undefined>;
  deleteModel(id: string): Promise<boolean>;
  
  // Product Colors methods
  getAllColors(): Promise<ProductColor[]>;
  getColor(id: string): Promise<ProductColor | undefined>;
  createColor(color: InsertProductColor): Promise<ProductColor>;
  updateColor(id: string, color: Partial<InsertProductColor>): Promise<ProductColor | undefined>;
  deleteColor(id: string): Promise<boolean>;
  
  // Product Storage Options methods
  getAllStorageOptions(): Promise<ProductStorageOption[]>;
  getStorageOption(id: string): Promise<ProductStorageOption | undefined>;
  createStorageOption(option: InsertProductStorageOption): Promise<ProductStorageOption>;
  updateStorageOption(id: string, option: Partial<InsertProductStorageOption>): Promise<ProductStorageOption | undefined>;
  deleteStorageOption(id: string): Promise<boolean>;
  
  // Product Prices methods
  getAllProductPrices(): Promise<ProductPrice[]>;
  getProductPrice(id: string): Promise<ProductPrice | undefined>;
  createProductPrice(price: InsertProductPrice): Promise<ProductPrice>;
  updateProductPrice(id: string, price: Partial<InsertProductPrice>): Promise<ProductPrice | undefined>;
  deleteProductPrice(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private variations: Map<string, ProductVariation>;
  private usedPhones: Map<string, UsedPhone>;
  private visits: Map<string, Visit>;
  private errorLogs: Map<string, ErrorLog>;
  private whatsappOrders: Map<string, WhatsappOrder>;
  private productModels: Map<string, ProductModel>;
  private productColors: Map<string, ProductColor>;
  private productStorageOptions: Map<string, ProductStorageOption>;
  private productPrices: Map<string, ProductPrice>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.variations = new Map();
    this.usedPhones = new Map();
    this.visits = new Map();
    this.errorLogs = new Map();
    this.whatsappOrders = new Map();
    this.productModels = new Map();
    this.productColors = new Map();
    this.productStorageOptions = new Map();
    this.productPrices = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: 'user',
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Used phones methods
  async getAllUsedPhones(): Promise<UsedPhone[]> {
    return Array.from(this.usedPhones.values());
  }

  async getUsedPhone(id: string): Promise<UsedPhone | undefined> {
    return this.usedPhones.get(id);
  }

  async createUsedPhone(insertPhone: InsertUsedPhone): Promise<UsedPhone> {
    const id = randomUUID();
    const phone: UsedPhone = {
      ...insertPhone,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UsedPhone;
    this.usedPhones.set(id, phone);
    return phone;
  }

  async updateUsedPhone(id: string, updates: Partial<InsertUsedPhone>): Promise<UsedPhone | undefined> {
    const existing = this.usedPhones.get(id);
    if (!existing) return undefined;

    const updated: UsedPhone = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    } as UsedPhone;
    this.usedPhones.set(id, updated);
    return updated;
  }

  async deleteUsedPhone(id: string): Promise<boolean> {
    return this.usedPhones.delete(id);
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Category;
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;

    const updated: Category = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    } as Category;
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    } as Product;
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Product Variation methods
  async getAllVariations(): Promise<ProductVariation[]> {
    return Array.from(this.variations.values());
  }

  async getVariation(id: string): Promise<ProductVariation | undefined> {
    return this.variations.get(id);
  }

  async getVariationsByProduct(productId: string): Promise<ProductVariation[]> {
    return Array.from(this.variations.values()).filter(v => v.productId === productId);
  }

  async createVariation(insertVariation: InsertProductVariation): Promise<ProductVariation> {
    const id = randomUUID();
    const variation: ProductVariation = {
      ...insertVariation,
      id,
      createdAt: new Date(),
    } as ProductVariation;
    this.variations.set(id, variation);
    return variation;
  }

  async updateVariation(id: string, updates: Partial<InsertProductVariation>): Promise<ProductVariation | undefined> {
    const existing = this.variations.get(id);
    if (!existing) return undefined;

    const updated: ProductVariation = {
      ...existing,
      ...updates,
    } as ProductVariation;
    this.variations.set(id, updated);
    return updated;
  }

  async deleteVariation(id: string): Promise<boolean> {
    return this.variations.delete(id);
  }

  async bulkUpdatePrices(updates: Array<{ id: string; price: string }>): Promise<number> {
    let count = 0;
    for (const update of updates) {
      const variation = this.variations.get(update.id);
      if (variation) {
        variation.price = update.price as any;
        this.variations.set(update.id, variation);
        count++;
      }
    }
    return count;
  }

  // Visit/Analytics methods
  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const id = randomUUID();
    const visit: Visit = {
      ...insertVisit,
      id,
      createdAt: new Date(),
    } as Visit;
    this.visits.set(id, visit);
    return visit;
  }

  async getVisitsStats(): Promise<any> {
    const allVisits = Array.from(this.visits.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVisits = allVisits.filter(v => v.createdAt && v.createdAt >= today);
    const uniqueIPs = new Set(allVisits.map(v => v.ip).filter(Boolean));
    
    return {
      total: allVisits.length,
      today: todayVisits.length,
      uniqueVisitors: uniqueIPs.size
    };
  }

  async getPopularPages(): Promise<any[]> {
    const allVisits = Array.from(this.visits.values());
    const pageCounts = new Map<string, number>();
    
    allVisits.forEach(visit => {
      const count = pageCounts.get(visit.path) || 0;
      pageCounts.set(visit.path, count + 1);
    });
    
    return Array.from(pageCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Error Logging methods
  async createErrorLog(insertError: InsertErrorLog): Promise<ErrorLog> {
    const id = randomUUID();
    const errorLog: ErrorLog = {
      ...insertError,
      id,
      createdAt: new Date(),
    } as ErrorLog;
    this.errorLogs.set(id, errorLog);
    
    // Log to console for immediate visibility
    console.error(`[${errorLog.severity.toUpperCase()}] ${errorLog.source}: ${errorLog.message}`);
    if (errorLog.stack) {
      console.error(errorLog.stack);
    }
    
    return errorLog;
  }

  async getErrorLogs(filters?: { resolved?: boolean; severity?: string; limit?: number }): Promise<ErrorLog[]> {
    let logs = Array.from(this.errorLogs.values());
    
    if (filters?.resolved !== undefined) {
      logs = logs.filter(log => log.resolved === filters.resolved);
    }
    
    if (filters?.severity) {
      logs = logs.filter(log => log.severity === filters.severity);
    }
    
    // Sort by newest first
    logs.sort((a, b) => {
      const timeA = a.createdAt ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt ? b.createdAt.getTime() : 0;
      return timeB - timeA;
    });
    
    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }
    
    return logs;
  }

  async getErrorStats(): Promise<any> {
    const allErrors = Array.from(this.errorLogs.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayErrors = allErrors.filter(e => e.createdAt && e.createdAt >= today);
    const unresolvedErrors = allErrors.filter(e => !e.resolved);
    
    const bySeverity = {
      critical: allErrors.filter(e => e.severity === 'critical').length,
      error: allErrors.filter(e => e.severity === 'error').length,
      warning: allErrors.filter(e => e.severity === 'warning').length,
    };
    
    const bySource = {
      frontend: allErrors.filter(e => e.source === 'frontend').length,
      backend: allErrors.filter(e => e.source === 'backend').length,
      api: allErrors.filter(e => e.source === 'api').length,
    };
    
    return {
      total: allErrors.length,
      today: todayErrors.length,
      unresolved: unresolvedErrors.length,
      bySeverity,
      bySource,
    };
  }

  async markErrorResolved(id: string): Promise<boolean> {
    const error = this.errorLogs.get(id);
    if (!error) return false;
    
    error.resolved = true;
    this.errorLogs.set(id, error);
    return true;
  }

  // WhatsApp Orders methods
  async getAllWhatsappOrders(): Promise<WhatsappOrder[]> {
    return Array.from(this.whatsappOrders.values());
  }

  async getWhatsappOrder(id: string): Promise<WhatsappOrder | undefined> {
    return this.whatsappOrders.get(id);
  }

  async createWhatsappOrder(insertOrder: InsertWhatsappOrder): Promise<WhatsappOrder> {
    const id = randomUUID();
    const order: WhatsappOrder = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as WhatsappOrder;
    this.whatsappOrders.set(id, order);
    return order;
  }

  async updateWhatsappOrder(id: string, updates: Partial<InsertWhatsappOrder>): Promise<WhatsappOrder | undefined> {
    const existing = this.whatsappOrders.get(id);
    if (!existing) return undefined;

    const updated: WhatsappOrder = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    } as WhatsappOrder;
    this.whatsappOrders.set(id, updated);
    return updated;
  }

  async deleteWhatsappOrder(id: string): Promise<boolean> {
    return this.whatsappOrders.delete(id);
  }

  // Product Models methods
  async getAllModels(): Promise<ProductModel[]> {
    return Array.from(this.productModels.values());
  }

  async getModel(id: string): Promise<ProductModel | undefined> {
    return this.productModels.get(id);
  }

  async createModel(insertModel: InsertProductModel): Promise<ProductModel> {
    const id = randomUUID();
    const model: ProductModel = {
      ...insertModel,
      id,
      createdAt: new Date(),
    } as ProductModel;
    this.productModels.set(id, model);
    return model;
  }

  async updateModel(id: string, updates: Partial<InsertProductModel>): Promise<ProductModel | undefined> {
    const existing = this.productModels.get(id);
    if (!existing) return undefined;

    const updated: ProductModel = {
      ...existing,
      ...updates,
    } as ProductModel;
    this.productModels.set(id, updated);
    return updated;
  }

  async deleteModel(id: string): Promise<boolean> {
    return this.productModels.delete(id);
  }

  // Product Colors methods
  async getAllColors(): Promise<ProductColor[]> {
    return Array.from(this.productColors.values());
  }

  async getColor(id: string): Promise<ProductColor | undefined> {
    return this.productColors.get(id);
  }

  async createColor(insertColor: InsertProductColor): Promise<ProductColor> {
    const id = randomUUID();
    const color: ProductColor = {
      ...insertColor,
      id,
      createdAt: new Date(),
    } as ProductColor;
    this.productColors.set(id, color);
    return color;
  }

  async updateColor(id: string, updates: Partial<InsertProductColor>): Promise<ProductColor | undefined> {
    const existing = this.productColors.get(id);
    if (!existing) return undefined;

    const updated: ProductColor = {
      ...existing,
      ...updates,
    } as ProductColor;
    this.productColors.set(id, updated);
    return updated;
  }

  async deleteColor(id: string): Promise<boolean> {
    return this.productColors.delete(id);
  }

  // Product Storage Options methods
  async getAllStorageOptions(): Promise<ProductStorageOption[]> {
    return Array.from(this.productStorageOptions.values());
  }

  async getStorageOption(id: string): Promise<ProductStorageOption | undefined> {
    return this.productStorageOptions.get(id);
  }

  async createStorageOption(insertOption: InsertProductStorageOption): Promise<ProductStorageOption> {
    const id = randomUUID();
    const option: ProductStorageOption = {
      ...insertOption,
      id,
      createdAt: new Date(),
    } as ProductStorageOption;
    this.productStorageOptions.set(id, option);
    return option;
  }

  async updateStorageOption(id: string, updates: Partial<InsertProductStorageOption>): Promise<ProductStorageOption | undefined> {
    const existing = this.productStorageOptions.get(id);
    if (!existing) return undefined;

    const updated: ProductStorageOption = {
      ...existing,
      ...updates,
    } as ProductStorageOption;
    this.productStorageOptions.set(id, updated);
    return updated;
  }

  async deleteStorageOption(id: string): Promise<boolean> {
    return this.productStorageOptions.delete(id);
  }

  // Product Prices methods
  async getAllProductPrices(): Promise<ProductPrice[]> {
    return Array.from(this.productPrices.values());
  }

  async getProductPrice(id: string): Promise<ProductPrice | undefined> {
    return this.productPrices.get(id);
  }

  async createProductPrice(insertPrice: InsertProductPrice): Promise<ProductPrice> {
    const id = randomUUID();
    const price: ProductPrice = {
      ...insertPrice,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ProductPrice;
    this.productPrices.set(id, price);
    return price;
  }

  async updateProductPrice(id: string, updates: Partial<InsertProductPrice>): Promise<ProductPrice | undefined> {
    const existing = this.productPrices.get(id);
    if (!existing) return undefined;

    const updated: ProductPrice = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    } as ProductPrice;
    this.productPrices.set(id, updated);
    return updated;
  }

  async deleteProductPrice(id: string): Promise<boolean> {
    return this.productPrices.delete(id);
  }
}

export const storage = new MemStorage();
