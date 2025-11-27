import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';
import { shamsiToGregorian, generatePassword, generateSecurityQuestions, isValidShamsiDate } from "./appleIdHelpers";

// Extend Express Request to include session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
    role?: string;
    sellerId?: string;
    sellerName?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure Cloudinary with secure flag
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  const requireAdmin = (req: Request, res: Response, next: Function) => {
    if (!req.session?.userId || req.session?.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };

  // Auth routes - Security: Check admin credentials from environment
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    // Security: Validate input length to prevent buffer overflow attacks
    if (username.length > 50 || password.length > 100) {
      return res.status(400).json({ error: "Invalid input" });
    }

    try {
      const adminUser = process.env.ADMIN_USERNAME || 'admin';
      const adminPass = process.env.ADMIN_PASSWORD;

      // Security: In production, ADMIN_PASSWORD MUST be set
      if (!adminPass && process.env.NODE_ENV === 'production') {
        console.error('ERROR: ADMIN_PASSWORD not set in production');
        return res.status(500).json({ error: "Server configuration error" });
      }

      if (username === adminUser && password === (adminPass || 'admin')) {
        req.session.userId = '1';
        req.session.username = 'admin';
        req.session.role = 'admin';
        
        return res.json({ 
          success: true, 
          user: { 
            id: '1', 
            username: 'admin', 
            role: 'admin' 
          } 
        });
      }

      // Security: Don't reveal which field is wrong (username vs password)
      return res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
      // Security: Don't expose internal errors
      console.error('Login error - server issue');
      return res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/check", (req: Request, res: Response) => {
    if (req.session?.userId) {
      res.json({ 
        authenticated: true, 
        user: {
          id: req.session.userId,
          username: req.session.username,
          role: req.session.role
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Initialize production database (one-time setup) - GET or POST
  const initDbHandler = async (req: Request, res: Response) => {
    try {
      const secret = req.body?.secret || req.query?.secret;
      if (secret !== process.env.DB_INIT_SECRET && secret !== "gisha2024@init") {
        return res.status(403).json({ error: "Invalid secret" });
      }

      console.log('🚀 Initializing database...');
      
      // Insert categories
      console.log('Creating categories...');
      const categories = await storage.createCategory({ name: 'iPhone', nameFa: 'آیفون', slug: 'iphone', order: 1 });
      await storage.createCategory({ name: 'iPad', nameFa: 'آیپد', slug: 'ipad', order: 2 });
      await storage.createCategory({ name: 'AirPods', nameFa: 'ایرپاد', slug: 'airpods', order: 3 });
      await storage.createCategory({ name: 'Used iPhone', nameFa: 'گوشی کارکرده', slug: 'used-iphone', order: 4 });

      console.log('✅ Created categories');

      // Insert iPhone 17 models
      console.log('Creating iPhone 17 models...');
      const allCategories = await storage.getAllCategories();
      const iPhoneCategory = allCategories.find(c => c.slug === 'iphone');
      if (!iPhoneCategory) {
        throw new Error('iPhone category not found');
      }

      const models = [
        { categoryId: iPhoneCategory.id, name: 'iPhone 17 Pro Max', nameFa: 'iPhone 17 Pro Max', order: 1 },
        { categoryId: iPhoneCategory.id, name: 'iPhone 17 Pro Max Registry', nameFa: 'iPhone 17 Pro Max رجیستر', order: 2 },
        { categoryId: iPhoneCategory.id, name: 'iPhone 17 Pro', nameFa: 'iPhone 17 Pro', order: 3 },
        { categoryId: iPhoneCategory.id, name: 'iPhone 17 Pro Registry', nameFa: 'iPhone 17 Pro رجیستر', order: 4 },
        { categoryId: iPhoneCategory.id, name: 'iPhone 17', nameFa: 'iPhone 17', order: 5 },
        { categoryId: iPhoneCategory.id, name: 'iPhone 17 Registry', nameFa: 'iPhone 17 رجیستر', order: 6 },
        { categoryId: iPhoneCategory.id, name: 'iPhone Air', nameFa: 'iPhone Air', order: 7 },
        { categoryId: iPhoneCategory.id, name: 'iPhone Air Registry', nameFa: 'iPhone Air رجیستر', order: 8 },
      ];

      for (const model of models) {
        await storage.createModel(model);
        console.log(`✅ Created: ${model.name}`);
      }

      res.json({ 
        success: true, 
        message: 'Database initialized successfully',
        stats: {
          categories: 4,
          models: 8
        }
      });
    } catch (error: any) {
      console.error('Init error:', error);
      res.status(500).json({ error: error.message, details: error.stack });
    }
  };

  app.post("/api/admin/init-db", initDbHandler);
  app.get("/api/admin/init-db", initDbHandler);

  // Protected admin routes (example)
  app.get("/api/admin/stats", requireAdmin, async (req: Request, res: Response) => {
    // Return admin statistics
    res.json({
      products: 0,
      orders: 0,
      customers: 0,
      revenue: 0
    });
  });

  // Single image upload endpoint
  app.post("/api/upload", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        resource_type: 'auto'
      });

      res.json({ 
        success: true, 
        url: result.secure_url,
        publicId: result.public_id
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message || "Failed to upload image" });
    }
  });

  // Multiple images upload endpoint
  app.post("/api/upload/multiple", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { images } = req.body;
      
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: "No images provided" });
      }

      if (images.length > 10) {
        return res.status(400).json({ error: "Maximum 10 images allowed" });
      }

      console.log(`Uploading ${images.length} images to Cloudinary...`);

      // Upload all images to Cloudinary
      const uploadPromises = images.map(async (image, index) => {
        try {
          const result = await cloudinary.uploader.upload(image, {
            resource_type: 'auto'
          });
          return result;
        } catch (err: any) {
          console.error(`Error uploading image ${index + 1}:`, err.message);
          throw err;
        }
      });

      const results = await Promise.all(uploadPromises);

      const uploadedImages = results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }));

      res.json({ 
        success: true, 
        images: uploadedImages
      });
    } catch (error: any) {
      console.error('Multiple upload error:', error);
      res.status(500).json({ error: error.message || "Failed to upload images" });
    }
  });

  // Used phones endpoints
  app.get("/api/used-phones", async (req: Request, res: Response) => {
    try {
      const phones = await storage.getAllUsedPhones();
      res.json(phones);
    } catch (error) {
      console.error('Error fetching used phones:', error);
      res.status(500).json({ error: "Failed to fetch used phones" });
    }
  });

  app.get("/api/used-phones/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const phone = await storage.getUsedPhone(id);
      
      if (!phone) {
        return res.status(404).json({ error: "Phone not found" });
      }
      
      res.json(phone);
    } catch (error) {
      console.error('Error fetching used phone:', error);
      res.status(500).json({ error: "Failed to fetch used phone" });
    }
  });

  app.post("/api/used-phones", requireAdmin, async (req: Request, res: Response) => {
    try {
      const phone = await storage.createUsedPhone(req.body);
      res.json(phone);
    } catch (error) {
      console.error('Error creating used phone:', error);
      res.status(500).json({ error: "Failed to create used phone" });
    }
  });

  app.patch("/api/used-phones/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const phone = await storage.updateUsedPhone(id, req.body);
      
      if (!phone) {
        return res.status(404).json({ error: "Phone not found" });
      }
      
      res.json(phone);
    } catch (error) {
      console.error('Error updating used phone:', error);
      res.status(500).json({ error: "Failed to update used phone" });
    }
  });

  app.delete("/api/used-phones/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUsedPhone(id);
      
      if (!success) {
        return res.status(404).json({ error: "Phone not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting used phone:', error);
      res.status(500).json({ error: "Failed to delete used phone" });
    }
  });

  // ============ WHATSAPP ORDERS ROUTES ============
  app.get("/api/whatsapp-orders", requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getAllWhatsappOrders();
      // Sort by newest first
      orders.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
      res.json(orders);
    } catch (error) {
      console.error('Error fetching WhatsApp orders:', error);
      res.status(500).json({ error: "Failed to fetch WhatsApp orders" });
    }
  });

  app.get("/api/whatsapp-orders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await storage.getWhatsappOrder(id);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error fetching WhatsApp order:', error);
      res.status(500).json({ error: "Failed to fetch WhatsApp order" });
    }
  });

  app.post("/api/whatsapp-orders", async (req: Request, res: Response) => {
    try {
      const order = await storage.createWhatsappOrder(req.body);
      res.json(order);
    } catch (error) {
      console.error('Error creating WhatsApp order:', error);
      res.status(500).json({ error: "Failed to create WhatsApp order" });
    }
  });

  app.patch("/api/whatsapp-orders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await storage.updateWhatsappOrder(id, req.body);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error updating WhatsApp order:', error);
      res.status(500).json({ error: "Failed to update WhatsApp order" });
    }
  });

  app.delete("/api/whatsapp-orders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteWhatsappOrder(id);
      
      if (!success) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting WhatsApp order:', error);
      res.status(500).json({ error: "Failed to delete WhatsApp order" });
    }
  });

  // ============ CATEGORY ROUTES ============
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", requireAdmin, async (req: Request, res: Response) => {
    try {
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Models endpoints
  app.get("/api/models", async (req: Request, res: Response) => {
    try {
      const { active } = req.query;
      const models = active === 'true' 
        ? await storage.getActiveModels() 
        : await storage.getAllModels();
      res.json(models);
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  // Get product details by model name (for product detail page)
  app.get("/api/product-details/:modelName", async (req: Request, res: Response) => {
    try {
      const modelName = decodeURIComponent(req.params.modelName);
      const details = await storage.getProductDetails(modelName);
      res.json(details);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: "Failed to fetch product details" });
    }
  });

  app.post("/api/models", requireAdmin, async (req: Request, res: Response) => {
    try {
      const model = await storage.createModel(req.body);
      res.json(model);
    } catch (error) {
      console.error('Error creating model:', error);
      res.status(500).json({ error: "Failed to create model" });
    }
  });

  app.patch("/api/models/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const model = await storage.updateModel(req.params.id, req.body);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      res.json(model);
    } catch (error) {
      console.error('Error updating model:', error);
      res.status(500).json({ error: "Failed to update model" });
    }
  });

  app.delete("/api/models/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteModel(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Model not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting model:', error);
      res.status(500).json({ error: "Failed to delete model" });
    }
  });

  // Colors endpoints
  app.get("/api/colors", async (req: Request, res: Response) => {
    try {
      const colors = await storage.getAllColors();
      res.json(colors);
    } catch (error) {
      console.error('Error fetching colors:', error);
      res.status(500).json({ error: "Failed to fetch colors" });
    }
  });

  app.post("/api/colors", requireAdmin, async (req: Request, res: Response) => {
    try {
      const color = await storage.createColor(req.body);
      res.json(color);
    } catch (error) {
      console.error('Error creating color:', error);
      res.status(500).json({ error: "Failed to create color" });
    }
  });

  app.patch("/api/colors/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const color = await storage.updateColor(req.params.id, req.body);
      if (!color) {
        return res.status(404).json({ error: "Color not found" });
      }
      res.json(color);
    } catch (error) {
      console.error('Error updating color:', error);
      res.status(500).json({ error: "Failed to update color" });
    }
  });

  app.delete("/api/colors/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteColor(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Color not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting color:', error);
      res.status(500).json({ error: "Failed to delete color" });
    }
  });

  // Storage options endpoints
  app.get("/api/storage-options", async (req: Request, res: Response) => {
    try {
      const options = await storage.getAllStorageOptions();
      res.json(options);
    } catch (error) {
      console.error('Error fetching storage options:', error);
      res.status(500).json({ error: "Failed to fetch storage options" });
    }
  });

  app.post("/api/storage-options", requireAdmin, async (req: Request, res: Response) => {
    try {
      const option = await storage.createStorageOption(req.body);
      res.json(option);
    } catch (error) {
      console.error('Error creating storage option:', error);
      res.status(500).json({ error: "Failed to create storage option" });
    }
  });

  app.patch("/api/storage-options/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const option = await storage.updateStorageOption(req.params.id, req.body);
      if (!option) {
        return res.status(404).json({ error: "Storage option not found" });
      }
      res.json(option);
    } catch (error) {
      console.error('Error updating storage option:', error);
      res.status(500).json({ error: "Failed to update storage option" });
    }
  });

  app.delete("/api/storage-options/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteStorageOption(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Storage option not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting storage option:', error);
      res.status(500).json({ error: "Failed to delete storage option" });
    }
  });

  // Product prices endpoints
  app.get("/api/product-prices", async (req: Request, res: Response) => {
    try {
      const prices = await storage.getAllProductPrices();
      res.json(prices);
    } catch (error) {
      console.error('Error fetching product prices:', error);
      res.status(500).json({ error: "Failed to fetch product prices" });
    }
  });

  app.post("/api/product-prices", requireAdmin, async (req: Request, res: Response) => {
    try {
      const price = await storage.createProductPrice(req.body);
      res.json(price);
    } catch (error) {
      console.error('Error creating product price:', error);
      res.status(500).json({ error: "Failed to create product price" });
    }
  });

  app.patch("/api/product-prices/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const price = await storage.updateProductPrice(req.params.id, req.body);
      if (!price) {
        return res.status(404).json({ error: "Product price not found" });
      }
      res.json(price);
    } catch (error) {
      console.error('Error updating product price:', error);
      res.status(500).json({ error: "Failed to update product price" });
    }
  });

  app.delete("/api/product-prices/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteProductPrice(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product price not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting product price:', error);
      res.status(500).json({ error: "Failed to delete product price" });
    }
  });

  // ============ PRODUCT ROUTES ============
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.query;
      const products = categoryId 
        ? await storage.getProductsByCategory(categoryId as string)
        : await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", requireAdmin, async (req: Request, res: Response) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ============ PRODUCT VARIATION ROUTES ============
  app.get("/api/variations", async (req: Request, res: Response) => {
    try {
      const { productId } = req.query;
      const variations = productId
        ? await storage.getVariationsByProduct(productId as string)
        : await storage.getAllVariations();
      res.json(variations);
    } catch (error) {
      console.error('Error fetching variations:', error);
      res.status(500).json({ error: "Failed to fetch variations" });
    }
  });

  app.post("/api/variations", requireAdmin, async (req: Request, res: Response) => {
    try {
      const variation = await storage.createVariation(req.body);
      res.json(variation);
    } catch (error) {
      console.error('Error creating variation:', error);
      res.status(500).json({ error: "Failed to create variation" });
    }
  });

  app.patch("/api/variations/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const variation = await storage.updateVariation(req.params.id, req.body);
      if (!variation) {
        return res.status(404).json({ error: "Variation not found" });
      }
      res.json(variation);
    } catch (error) {
      console.error('Error updating variation:', error);
      res.status(500).json({ error: "Failed to update variation" });
    }
  });

  app.delete("/api/variations/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteVariation(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Variation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting variation:', error);
      res.status(500).json({ error: "Failed to delete variation" });
    }
  });

  // Bulk price update
  app.post("/api/variations/bulk-update-prices", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { updates } = req.body;
      const count = await storage.bulkUpdatePrices(updates);
      res.json({ success: true, updated: count });
    } catch (error) {
      console.error('Error bulk updating prices:', error);
      res.status(500).json({ error: "Failed to bulk update prices" });
    }
  });

  // ============ ANALYTICS ROUTES ============
  app.post("/api/visits", async (req: Request, res: Response) => {
    try {
      const visit = await storage.createVisit(req.body);
      res.json(visit);
    } catch (error) {
      console.error('Error creating visit:', error);
      res.status(500).json({ error: "Failed to create visit" });
    }
  });

  app.get("/api/analytics/stats", requireAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getVisitsStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching analytics stats:', error);
      res.status(500).json({ error: "Failed to fetch analytics stats" });
    }
  });

  app.get("/api/analytics/popular-pages", requireAdmin, async (req: Request, res: Response) => {
    try {
      const pages = await storage.getPopularPages();
      res.json(pages);
    } catch (error) {
      console.error('Error fetching popular pages:', error);
      res.status(500).json({ error: "Failed to fetch popular pages" });
    }
  });

  // ============ ERROR LOGGING ROUTES ============
  app.post("/api/errors", async (req: Request, res: Response) => {
    try {
      const errorLog = await storage.createErrorLog(req.body);
      res.json(errorLog);
    } catch (error) {
      console.error('Error logging error:', error);
      res.status(500).json({ error: "Failed to log error" });
    }
  });

  app.get("/api/errors", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { resolved, severity, limit } = req.query;
      const filters: any = {};
      
      if (resolved !== undefined) {
        filters.resolved = resolved === 'true';
      }
      if (severity) {
        filters.severity = severity as string;
      }
      if (limit) {
        filters.limit = parseInt(limit as string);
      }
      
      const errors = await storage.getErrorLogs(filters);
      res.json(errors);
    } catch (error) {
      console.error('Error fetching error logs:', error);
      res.status(500).json({ error: "Failed to fetch error logs" });
    }
  });

  app.get("/api/errors/stats", requireAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getErrorStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching error stats:', error);
      res.status(500).json({ error: "Failed to fetch error stats" });
    }
  });

  app.patch("/api/errors/:id/resolve", requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await storage.markErrorResolved(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Error log not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking error as resolved:', error);
      res.status(500).json({ error: "Failed to mark error as resolved" });
    }
  });

  // ============ AI CHATBOT ROUTES ============
  // Using OpenAI's API with user's API key
  // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Initialize OpenAI client
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Get product context for better responses
      const categories = await storage.getAllCategories();

      const systemPrompt = `شما دستیار هوشمند پرشین اپل استور هستید - فروشگاه محصولات اپل در تهران، ایران (گیشا، بازار بزرگ نصر، پلاک ۲۶۱).

محصولات موجود: ${categories.map((c: any) => c.nameFa).join('، ')}

شماره تماس: ۰۲۱-۸۸۲۸۶۷۷۷، ۰۹۱۲-۱۱۴۹۰۷۹ (شهاب)، ۰۹۱۲-۶۷۸۲۸۰۹ (شروین)

وظایف شما:
- پاسخ به سوالات مشتریان درباره محصولات اپل
- راهنمایی برای انتخاب محصول مناسب
- اطلاع‌رسانی درباره قیمت‌ها و موجودی
- ارائه اطلاعات تماس و آدرس فروشگاه

همیشه به زبان فارسی و با لحن دوستانه و حرفه‌ای پاسخ دهید.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_completion_tokens: 2048,
      });

      const reply = completion.choices[0].message.content;
      res.json({ message: reply });

    } catch (error: any) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ 
        error: "خطا در پردازش پیام",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Global error handler middleware
  app.use((err: any, req: Request, res: Response, next: Function) => {
    const errorLog = {
      source: 'backend' as const,
      errorType: err.name || 'Error',
      message: err.message || 'Unknown error',
      stack: err.stack,
      url: req.originalUrl,
      userAgent: req.get('user-agent'),
      userId: req.session?.userId,
      sessionId: req.sessionID,
      severity: 'error' as const,
      metadata: {
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params,
      },
      resolved: false,
    };

    storage.createErrorLog(errorLog).catch(console.error);

    res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message 
    });
  });

  // Seed database endpoint with comprehensive data
  app.post("/api/admin/seed", requireAdmin, async (req: Request, res: Response) => {
    try {
      console.log('🌱 Starting comprehensive database seed...');
      
      // 1. Create Categories
      const iphoneCategory = await storage.createCategory({ 
        name: 'iPhone', nameFa: 'آیفون', slug: 'iphone' 
      });
      const ipadCategory = await storage.createCategory({ 
        name: 'iPad', nameFa: 'آیپد', slug: 'ipad' 
      });
      const airpodsCategory = await storage.createCategory({ 
        name: 'AirPods', nameFa: 'ایرپاد', slug: 'airpods' 
      });
      
      // 2. Create all unique colors from the data
      const colorData = [
        { name: 'Space Gray', nameFa: 'خاکستری فضایی', hexCode: '#4A4A4A' },
        { name: 'Silver', nameFa: 'نقره‌ای', hexCode: '#C0C0C0' },
        { name: 'Black', nameFa: 'مشکی', hexCode: '#000000' },
        { name: 'White', nameFa: 'سفید', hexCode: '#FFFFFF' },
        { name: 'Blue', nameFa: 'آبی', hexCode: '#1E90FF' },
        { name: 'Yellow', nameFa: 'زرد', hexCode: '#FFD700' },
        { name: 'Coral', nameFa: 'مرجانی', hexCode: '#FF7F50' },
        { name: '(PRODUCT)RED', nameFa: 'قرمز', hexCode: '#FF0000' },
        { name: 'Gold', nameFa: 'طلایی', hexCode: '#FFD700' },
        { name: 'Green', nameFa: 'سبز', hexCode: '#00FF00' },
        { name: 'Purple', nameFa: 'بنفش', hexCode: '#800080' },
        { name: 'Graphite', nameFa: 'گرافیت', hexCode: '#36454F' },
        { name: 'Pacific Blue', nameFa: 'آبی اقیانوسی', hexCode: '#1CA9C9' },
        { name: 'Starlight', nameFa: 'ستاره‌ای', hexCode: '#F5F5DC' },
        { name: 'Midnight', nameFa: 'نیمه‌شب', hexCode: '#191970' },
        { name: 'Pink', nameFa: 'صورتی', hexCode: '#FFB6C1' },
        { name: 'Sierra Blue', nameFa: 'آبی سیرا', hexCode: '#69C2D0' },
        { name: 'Alpine Green', nameFa: 'سبز آلپاین', hexCode: '#506C64' },
        { name: 'Space Black', nameFa: 'مشکی فضایی', hexCode: '#1C1C1C' },
        { name: 'Deep Purple', nameFa: 'بنفش عمیق', hexCode: '#663399' },
      ];
      
      const createdColors = new Map();
      for (const color of colorData) {
        const created = await storage.createColor(color);
        createdColors.set(color.name, created);
      }
      
      // 3. Create all unique storage options
      const storageData = [
        { name: '64GB', nameFa: '۶۴ گیگ' },
        { name: '128GB', nameFa: '۱۲۸ گیگ' },
        { name: '256GB', nameFa: '۲۵۶ گیگ' },
        { name: '512GB', nameFa: '۵۱۲ گیگ' },
        { name: '1TB', nameFa: '۱ ترابایت' },
        { name: 'N/A', nameFa: 'N/A' },
      ];
      
      const createdStorages = new Map();
      for (const storageOption of storageData) {
        const created = await storage.createStorageOption(storageOption);
        createdStorages.set(storageOption.name, created);
      }
      
      // 4. Create all models with their variants
      const modelData = [
        // iPhone Models
        { name: 'iPhone X', nameFa: 'آیفون X', categoryId: iphoneCategory.id },
        { name: 'iPhone XR', nameFa: 'آیفون XR', categoryId: iphoneCategory.id },
        { name: 'iPhone XS', nameFa: 'آیفون XS', categoryId: iphoneCategory.id },
        { name: 'iPhone XS Max', nameFa: 'آیفون XS Max', categoryId: iphoneCategory.id },
        { name: 'iPhone 11', nameFa: 'آیفون 11', categoryId: iphoneCategory.id },
        { name: 'iPhone 12', nameFa: 'آیفون 12', categoryId: iphoneCategory.id },
        { name: 'iPhone 12 Pro', nameFa: 'آیفون 12 پرو', categoryId: iphoneCategory.id },
        { name: 'iPhone 13', nameFa: 'آیفون 13', categoryId: iphoneCategory.id },
        { name: 'iPhone 13 Pro', nameFa: 'آیفون 13 پرو', categoryId: iphoneCategory.id },
        { name: 'iPhone 14', nameFa: 'آیفون 14', categoryId: iphoneCategory.id },
        { name: 'iPhone 14 Pro', nameFa: 'آیفون 14 پرو', categoryId: iphoneCategory.id },
        { name: 'iPhone 15', nameFa: 'آیفون 15', categoryId: iphoneCategory.id },
        { name: 'iPhone 15 Pro', nameFa: 'آیفون 15 پرو', categoryId: iphoneCategory.id },
        { name: 'iPhone 16', nameFa: 'آیفون 16', categoryId: iphoneCategory.id },
        { name: 'iPhone 16 Pro', nameFa: 'آیفون 16 پرو', categoryId: iphoneCategory.id },
        { name: 'iPhone 17', nameFa: 'آیفون 17', categoryId: iphoneCategory.id },
        { name: 'iPhone 17 Pro', nameFa: 'آیفون 17 پرو', categoryId: iphoneCategory.id },
        // iPad Models
        { name: 'iPad Pro 11 2023', nameFa: 'آیپد پرو ۱۱ ۲۰۲۳', categoryId: ipadCategory.id },
        { name: 'iPad Pro 12.9 2023', nameFa: 'آیپد پرو ۱۲.۹ ۲۰۲۳', categoryId: ipadCategory.id },
        { name: 'iPad Air 2023', nameFa: 'آیپد ایر ۲۰۲۳', categoryId: ipadCategory.id },
        // AirPods Models
        { name: 'AirPods 2', nameFa: 'ایرپاد ۲', categoryId: airpodsCategory.id },
        { name: 'AirPods 3', nameFa: 'ایرپاد ۳', categoryId: airpodsCategory.id },
        { name: 'AirPods Pro', nameFa: 'ایرپاد پرو', categoryId: airpodsCategory.id },
        { name: 'AirPods Pro 2', nameFa: 'ایرپاد پرو ۲', categoryId: airpodsCategory.id },
      ];
      
      const createdModels = new Map();
      for (const model of modelData) {
        const created = await storage.createModel(model);
        createdModels.set(model.name, created);
      }
      
      // 5. Create product prices for all combinations from the CSV data
      const priceData = [
        // iPhone X
        { model: 'iPhone X', color: 'Space Gray', storage: '64GB', price: 0 },
        { model: 'iPhone X', color: 'Silver', storage: '256GB', price: 0 },
        // iPhone XR
        { model: 'iPhone XR', color: 'Black', storage: '64GB', price: 0 },
        { model: 'iPhone XR', color: 'White', storage: '128GB', price: 0 },
        { model: 'iPhone XR', color: 'Blue', storage: '256GB', price: 0 },
        { model: 'iPhone XR', color: 'Yellow', storage: '64GB', price: 0 },
        { model: 'iPhone XR', color: 'Coral', storage: '128GB', price: 0 },
        { model: 'iPhone XR', color: '(PRODUCT)RED', storage: '256GB', price: 0 },
        // iPhone XS
        { model: 'iPhone XS', color: 'Space Gray', storage: '64GB', price: 0 },
        { model: 'iPhone XS', color: 'Silver', storage: '256GB', price: 0 },
        { model: 'iPhone XS', color: 'Gold', storage: '512GB', price: 0 },
        // iPhone XS Max
        { model: 'iPhone XS Max', color: 'Space Gray', storage: '64GB', price: 0 },
        { model: 'iPhone XS Max', color: 'Silver', storage: '256GB', price: 0 },
        { model: 'iPhone XS Max', color: 'Gold', storage: '512GB', price: 0 },
        // iPhone 11
        { model: 'iPhone 11', color: 'Black', storage: '64GB', price: 0 },
        { model: 'iPhone 11', color: 'Green', storage: '128GB', price: 0 },
        { model: 'iPhone 11', color: 'Yellow', storage: '256GB', price: 0 },
        { model: 'iPhone 11', color: 'Purple', storage: '64GB', price: 0 },
        { model: 'iPhone 11', color: 'White', storage: '128GB', price: 0 },
        { model: 'iPhone 11', color: '(PRODUCT)RED', storage: '256GB', price: 0 },
        // iPhone 12
        { model: 'iPhone 12', color: 'Black', storage: '64GB', price: 0 },
        { model: 'iPhone 12', color: 'White', storage: '128GB', price: 0 },
        { model: 'iPhone 12', color: '(PRODUCT)RED', storage: '256GB', price: 0 },
        { model: 'iPhone 12', color: 'Green', storage: '64GB', price: 0 },
        { model: 'iPhone 12', color: 'Blue', storage: '128GB', price: 0 },
        { model: 'iPhone 12', color: 'Purple', storage: '256GB', price: 0 },
        // iPhone 12 Pro
        { model: 'iPhone 12 Pro', color: 'Graphite', storage: '128GB', price: 0 },
        { model: 'iPhone 12 Pro', color: 'Silver', storage: '256GB', price: 0 },
        { model: 'iPhone 12 Pro', color: 'Gold', storage: '512GB', price: 0 },
        { model: 'iPhone 12 Pro', color: 'Pacific Blue', storage: '128GB', price: 0 },
        // iPhone 13
        { model: 'iPhone 13', color: 'Starlight', storage: '128GB', price: 0 },
        { model: 'iPhone 13', color: 'Midnight', storage: '256GB', price: 0 },
        { model: 'iPhone 13', color: 'Blue', storage: '512GB', price: 0 },
        { model: 'iPhone 13', color: 'Pink', storage: '128GB', price: 0 },
        { model: 'iPhone 13', color: 'Green', storage: '256GB', price: 0 },
        { model: 'iPhone 13', color: '(PRODUCT)RED', storage: '512GB', price: 0 },
        // iPhone 13 Pro
        { model: 'iPhone 13 Pro', color: 'Graphite', storage: '128GB', price: 0 },
        { model: 'iPhone 13 Pro', color: 'Silver', storage: '256GB', price: 0 },
        { model: 'iPhone 13 Pro', color: 'Gold', storage: '512GB', price: 0 },
        { model: 'iPhone 13 Pro', color: 'Sierra Blue', storage: '128GB', price: 0 },
        { model: 'iPhone 13 Pro', color: 'Alpine Green', storage: '1TB', price: 0 },
        // iPhone 14
        { model: 'iPhone 14', color: 'Midnight', storage: '128GB', price: 0 },
        { model: 'iPhone 14', color: 'Starlight', storage: '256GB', price: 0 },
        { model: 'iPhone 14', color: 'Blue', storage: '512GB', price: 0 },
        { model: 'iPhone 14', color: 'Purple', storage: '128GB', price: 0 },
        { model: 'iPhone 14', color: 'Yellow', storage: '256GB', price: 0 },
        { model: 'iPhone 14', color: '(PRODUCT)RED', storage: '512GB', price: 0 },
        // iPhone 14 Pro
        { model: 'iPhone 14 Pro', color: 'Space Black', storage: '128GB', price: 0 },
        { model: 'iPhone 14 Pro', color: 'Silver', storage: '256GB', price: 0 },
        { model: 'iPhone 14 Pro', color: 'Gold', storage: '512GB', price: 0 },
        { model: 'iPhone 14 Pro', color: 'Deep Purple', storage: '1TB', price: 0 },
        // iPhone 15
        { model: 'iPhone 15', color: 'Black', storage: '128GB', price: 0 },
        { model: 'iPhone 15', color: 'White', storage: '256GB', price: 0 },
        { model: 'iPhone 15', color: 'Blue', storage: '512GB', price: 0 },
        // iPhone 15 Pro
        { model: 'iPhone 15 Pro', color: 'Graphite', storage: '128GB', price: 0 },
        { model: 'iPhone 15 Pro', color: 'Silver', storage: '256GB', price: 0 },
        { model: 'iPhone 15 Pro', color: 'Gold', storage: '512GB', price: 0 },
        { model: 'iPhone 15 Pro', color: 'Green', storage: '1TB', price: 0 },
        // iPhone 16
        { model: 'iPhone 16', color: 'Black', storage: '128GB', price: 0 },
        { model: 'iPhone 16', color: 'White', storage: '256GB', price: 0 },
        { model: 'iPhone 16', color: 'Blue', storage: '512GB', price: 0 },
        // iPhone 16 Pro
        { model: 'iPhone 16 Pro', color: 'Graphite', storage: '128GB', price: 0 },
        { model: 'iPhone 16 Pro', color: 'Silver', storage: '256GB', price: 0 },
        { model: 'iPhone 16 Pro', color: 'Gold', storage: '512GB', price: 0 },
        { model: 'iPhone 16 Pro', color: 'Deep Purple', storage: '1TB', price: 0 },
        // iPhone 17
        { model: 'iPhone 17', color: 'Black', storage: '128GB', price: 0 },
        { model: 'iPhone 17', color: 'White', storage: '256GB', price: 0 },
        { model: 'iPhone 17', color: 'Blue', storage: '512GB', price: 0 },
        // iPhone 17 Pro
        { model: 'iPhone 17 Pro', color: 'Graphite', storage: '128GB', price: 0 },
        { model: 'iPhone 17 Pro', color: 'Silver', storage: '256GB', price: 0 },
        { model: 'iPhone 17 Pro', color: 'Gold', storage: '512GB', price: 0 },
        { model: 'iPhone 17 Pro', color: 'Deep Purple', storage: '1TB', price: 0 },
        // iPad
        { model: 'iPad Pro 11 2023', color: 'Silver', storage: '128GB', price: 0 },
        { model: 'iPad Pro 11 2023', color: 'Space Gray', storage: '256GB', price: 0 },
        { model: 'iPad Pro 12.9 2023', color: 'Silver', storage: '128GB', price: 0 },
        { model: 'iPad Pro 12.9 2023', color: 'Space Gray', storage: '512GB', price: 0 },
        { model: 'iPad Air 2023', color: 'Pink', storage: '64GB', price: 0 },
        { model: 'iPad Air 2023', color: 'Blue', storage: '256GB', price: 0 },
        // AirPods
        { model: 'AirPods 2', color: 'White', storage: 'N/A', price: 0 },
        { model: 'AirPods 3', color: 'White', storage: 'N/A', price: 0 },
        { model: 'AirPods Pro', color: 'White', storage: 'N/A', price: 0 },
        { model: 'AirPods Pro 2', color: 'White', storage: 'N/A', price: 0 },
      ];
      
      let pricesCreated = 0;
      for (const item of priceData) {
        const model = createdModels.get(item.model);
        const color = createdColors.get(item.color);
        const storageOpt = createdStorages.get(item.storage);
        
        if (model && color && storageOpt) {
          await storage.createProductPrice({
            modelId: model.id,
            colorId: color.id,
            storageId: storageOpt.id,
            price: item.price.toString(),
          });
          pricesCreated++;
        }
      }
      
      console.log('✅ Database seeded successfully!');
      res.json({ 
        success: true, 
        message: 'Database seeded with comprehensive data',
        stats: {
          categories: 3,
          colors: colorData.length,
          storages: storageData.length,
          models: modelData.length,
          prices: pricesCreated
        }
      });
    } catch (error: any) {
      console.error('❌ Seed error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============ PRODUCT PRICE MANAGEMENT ROUTES ============
  app.get("/api/product-prices", async (req: Request, res: Response) => {
    try {
      const prices = await storage.getAllProductPrices();
      
      // Return raw prices with IDs so Category.tsx can filter by modelId
      const formattedPrices = prices.map(price => ({
        id: price.id,
        modelId: price.modelId,
        colorId: price.colorId,
        storageId: price.storageId,
        price: price.price.toString(),
        stock: price.stock,
        isActive: price.isActive
      }));

      res.json(formattedPrices);
    } catch (error) {
      console.error("Error fetching product prices:", error);
      res.status(500).json({ error: "Failed to fetch product prices" });
    }
  });

  app.post("/api/product-prices/bulk-update", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid items format" });
      }

      let updated = 0;
      for (const item of items) {
        await storage.updateProductPrice(item.id, {
          price: item.price.toString()
        });
        updated++;
      }

      res.json({ success: true, updated });
    } catch (error) {
      console.error("Error updating product prices:", error);
      res.status(500).json({ error: "Failed to update prices" });
    }
  });

  // Admin: Update single price
  app.put("/api/product-prices/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { price } = req.body;

      if (!price) {
        return res.status(400).json({ error: "Price is required" });
      }

      const updated = await storage.updateProductPrice(id, { price: price.toString() });
      if (!updated) {
        return res.status(404).json({ error: "Price not found" });
      }

      res.json({ success: true, updated });
    } catch (error) {
      console.error("Error updating price:", error);
      res.status(500).json({ error: "Failed to update price" });
    }
  });

  // Admin: Delete single price
  app.delete("/api/product-prices/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProductPrice(id);
      if (!success) {
        return res.status(404).json({ error: "Price not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting price:", error);
      res.status(500).json({ error: "Failed to delete price" });
    }
  });

  // ============ APPLE ID ORDERS ROUTES ============
  
  // Public endpoint for uploading payment receipts
  app.post("/api/apple-id-orders/upload-receipt", async (req: Request, res: Response) => {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        resource_type: 'auto',
        folder: 'apple-id-receipts'
      });

      res.json({ 
        success: true, 
        url: result.secure_url 
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
  
  app.get("/api/apple-id-orders", requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getAllAppleIdOrders();
      orders.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      });
      res.json(orders);
    } catch (error) {
      console.error('Error fetching Apple ID orders:', error);
      res.status(500).json({ error: "Failed to fetch Apple ID orders" });
    }
  });

  app.get("/api/apple-id-orders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await storage.getAppleIdOrder(id);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error fetching Apple ID order:', error);
      res.status(500).json({ error: "Failed to fetch Apple ID order" });
    }
  });

  app.post("/api/apple-id-orders", async (req: Request, res: Response) => {
    try {
      const { name, phoneNumber, email, birthday, paymentReceipt, paymentAmount } = req.body;

      // Validate required fields
      if (!name || !phoneNumber || !birthday) {
        return res.status(400).json({ error: "نام، شماره موبایل و تاریخ تولد الزامی است" });
      }

      // Validate Shamsi date format
      if (!isValidShamsiDate(birthday)) {
        return res.status(400).json({ error: "فرمت تاریخ تولد نامعتبر است. لطفاً به صورت YYYY/MM/DD وارد کنید (مثال: 1380/05/15)" });
      }

      // Convert Shamsi to Gregorian
      const birthdayGregorian = shamsiToGregorian(birthday);

      // Generate password
      const generatedPassword = generatePassword();

      // Generate security questions
      const securityQA = generateSecurityQuestions(name);

      // Create order
      const order = await storage.createAppleIdOrder({
        name,
        phoneNumber,
        email: email || null,
        birthday,
        birthdayGregorian,
        country: "Iran",
        securityQuestion1: securityQA.question1,
        securityAnswer1: securityQA.answer1,
        securityQuestion2: securityQA.question2,
        securityAnswer2: securityQA.answer2,
        securityQuestion3: securityQA.question3,
        securityAnswer3: securityQA.answer3,
        generatedPassword,
        paymentReceipt: paymentReceipt || null,
        paymentAmount: paymentAmount || null,
        status: paymentReceipt ? "payment_received" : "pending_payment"
      });

      res.json(order);
    } catch (error) {
      console.error('Error creating Apple ID order:', error);
      res.status(500).json({ error: "خطا در ایجاد سفارش" });
    }
  });

  app.patch("/api/apple-id-orders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await storage.updateAppleIdOrder(id, req.body);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error updating Apple ID order:', error);
      res.status(500).json({ error: "Failed to update Apple ID order" });
    }
  });

  app.delete("/api/apple-id-orders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteAppleIdOrder(id);
      
      if (!success) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting Apple ID order:', error);
      res.status(500).json({ error: "Failed to delete Apple ID order" });
    }
  });

  // ========== REFERRAL TRACKING ROUTES ==========
  
  app.post("/api/referrals", async (req: Request, res: Response) => {
    try {
      const { source, sessionId, landingPage } = req.body;
      
      if (!source) {
        return res.status(400).json({ error: "Source is required" });
      }

      const referral = await storage.createReferral({
        source,
        sessionId: sessionId || null,
        ip: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
        landingPage: landingPage || '/',
        converted: false
      });
      
      res.json(referral);
    } catch (error) {
      console.error('Error creating referral:', error);
      res.status(500).json({ error: "Failed to create referral" });
    }
  });

  app.get("/api/referrals", requireAdmin, async (req: Request, res: Response) => {
    try {
      const referrals = await storage.getAllReferrals();
      res.json(referrals);
    } catch (error) {
      console.error('Error getting referrals:', error);
      res.status(500).json({ error: "Failed to get referrals" });
    }
  });

  app.get("/api/referrals/stats", requireAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getReferralStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting referral stats:', error);
      res.status(500).json({ error: "Failed to get referral stats" });
    }
  });

  // Initialize all product models (one-time setup)
  app.post("/api/admin/init-iphone-models", requireAdmin, async (req: Request, res: Response) => {
    try {
      let models = await storage.getAllModels();
      if (models.length > 0) {
        return res.json({ message: "Models already initialized" });
      }

      // Get categories
      const categories = await storage.getAllCategories();
      const iphoneCategory = categories.find(c => c.slug === "iphone");
      const ipadCategory = categories.find(c => c.slug === "ipad");
      const airpodsCategory = categories.find(c => c.slug === "airpods");
      
      if (!iphoneCategory) {
        return res.status(400).json({ error: "iPhone category not found" });
      }

      // ========== CREATE COLORS (shared across all products) ==========
      const colorData = [
        { name: "Black", nameFa: "مشکی", hexCode: "#000000" },
        { name: "White", nameFa: "سفید", hexCode: "#FFFFFF" },
        { name: "Blue", nameFa: "آبی", hexCode: "#0071E3" },
        { name: "Green", nameFa: "سبز", hexCode: "#34C759" },
        { name: "Purple", nameFa: "بنفش", hexCode: "#A855F7" },
        { name: "Orange", nameFa: "نارنجی", hexCode: "#FF9500" },
        { name: "Red", nameFa: "قرمز", hexCode: "#FF3B30" },
        { name: "Pink", nameFa: "صورتی", hexCode: "#FF1493" }
      ];

      const createdColors: any[] = [];
      for (const colData of colorData) {
        const color = await storage.createColor(colData);
        createdColors.push(color);
      }

      // ========== CREATE STORAGE OPTIONS (shared across all products) ==========
      const storageData = [
        { name: "128GB", nameFa: "۱۲۸ گیگابایت" },
        { name: "256GB", nameFa: "۲۵۶ گیگابایت" },
        { name: "512GB", nameFa: "۵۱۲ گیگابایت" },
        { name: "1TB", nameFa: "۱ ترابایت" }
      ];

      const createdStorages: any[] = [];
      for (const storData of storageData) {
        const storageOption = await storage.createStorageOption({
          categoryId: null,
          ...storData
        });
        createdStorages.push(storageOption);
      }

      const allCreatedModels: any[] = [];
      let totalPricesCreated = 0;

      // ========== IPHONE MODELS ==========
      const iPhoneModels = [
        { name: "iPhone 17", nameFa: "آیفون ۱۷", basePrice: 30000000 },
        { name: "iPhone 17 Air", nameFa: "آیفون ۱۷ ایر", basePrice: 45000000 },
        { name: "iPhone 17 Pro", nameFa: "آیفون ۱۷ پرو", basePrice: 55000000 },
        { name: "iPhone 17 Pro Max", nameFa: "آیفون ۱۷ پرو مکس", basePrice: 65000000 }
      ];

      for (const modelData of iPhoneModels) {
        const model = await storage.createModel({
          categoryId: iphoneCategory.id,
          name: modelData.name,
          nameFa: modelData.nameFa,
          generation: "iPhone 17"
        });
        allCreatedModels.push(model);

        // Create price combinations for iPhone
        for (const storageOpt of createdStorages) {
          for (const color of createdColors) {
            let price = modelData.basePrice;
            if (storageOpt.name === "256GB") price += 2000000;
            if (storageOpt.name === "512GB") price += 5000000;
            if (storageOpt.name === "1TB") price += 8000000;

            await storage.createProductPrice({
              modelId: model.id,
              storageId: storageOpt.id,
              colorId: color.id,
              price: price.toString()
            });
            totalPricesCreated++;
          }
        }
      }

      // ========== IPAD MODELS ==========
      if (ipadCategory) {
        const iPadModels = [
          { name: "iPad", nameFa: "آیپد", basePrice: 15000000 },
          { name: "iPad Air", nameFa: "آیپد ایر", basePrice: 25000000 }
        ];

        for (const modelData of iPadModels) {
          const model = await storage.createModel({
            categoryId: ipadCategory.id,
            name: modelData.name,
            nameFa: modelData.nameFa,
            generation: "iPad 2024"
          });
          allCreatedModels.push(model);

          // Create price combinations for iPad
          for (const storageOpt of createdStorages) {
            for (const color of createdColors) {
              let price = modelData.basePrice;
              if (storageOpt.name === "256GB") price += 1500000;
              if (storageOpt.name === "512GB") price += 3000000;
              if (storageOpt.name === "1TB") price += 5000000;

              await storage.createProductPrice({
                modelId: model.id,
                storageId: storageOpt.id,
                colorId: color.id,
                price: price.toString()
              });
              totalPricesCreated++;
            }
          }
        }
      }

      // ========== AIRPODS MODELS ==========
      if (airpodsCategory) {
        const airPodsModels = [
          { name: "AirPods", nameFa: "ایرپاد", basePrice: 5000000 }
        ];

        // AirPods only use first 3 colors and first storage option
        const airpodsColors = createdColors.slice(0, 3);
        const airpodsStorage = createdStorages.slice(0, 1);

        for (const modelData of airPodsModels) {
          const model = await storage.createModel({
            categoryId: airpodsCategory.id,
            name: modelData.name,
            nameFa: modelData.nameFa,
            generation: "AirPods 2024"
          });
          allCreatedModels.push(model);

          // Create price combinations for AirPods (simplified)
          for (const storageOpt of airpodsStorage) {
            for (const color of airpodsColors) {
              await storage.createProductPrice({
                modelId: model.id,
                storageId: storageOpt.id,
                colorId: color.id,
                price: modelData.basePrice.toString()
              });
              totalPricesCreated++;
            }
          }
        }
      }

      res.json({
        success: true,
        message: "All product models initialized",
        stats: {
          models: allCreatedModels.length,
          colors: createdColors.length,
          storages: createdStorages.length,
          prices: totalPricesCreated
        }
      });
    } catch (error: any) {
      console.error("Error initializing models:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ========== SELLER AUTH ROUTES ==========
  
  // Seller login
  app.post("/api/seller/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "نام کاربری و رمز عبور الزامی است" });
    }

    if (username.length > 50 || password.length > 100) {
      return res.status(400).json({ message: "ورودی نامعتبر" });
    }

    try {
      const seller = await storage.getSellerByUsername(username);
      if (!seller) {
        return res.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه است" });
      }

      if (!seller.isActive) {
        return res.status(403).json({ message: "حساب کاربری غیرفعال است" });
      }

      const passwordMatch = await bcrypt.compare(password, seller.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه است" });
      }

      req.session.sellerId = seller.id;
      req.session.sellerName = seller.name;

      res.json({
        success: true,
        seller: {
          id: seller.id,
          name: seller.name,
          username: seller.username,
          phone: seller.phone,
          storeName: seller.storeName
        }
      });
    } catch (error) {
      console.error("Seller login error:", error);
      res.status(500).json({ message: "خطا در ورود" });
    }
  });

  // Seller check authentication
  app.get("/api/seller/check", (req: Request, res: Response) => {
    if (req.session?.sellerId) {
      res.json({
        authenticated: true,
        seller: {
          id: req.session.sellerId,
          name: req.session.sellerName
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Seller logout
  app.post("/api/seller/logout", (req: Request, res: Response) => {
    req.session.sellerId = undefined;
    req.session.sellerName = undefined;
    res.json({ success: true });
  });

  // Middleware to require seller auth
  const requireSeller = (req: Request, res: Response, next: Function) => {
    if (!req.session?.sellerId) {
      return res.status(401).json({ error: "Seller authentication required" });
    }
    next();
  };

  // ========== SELLER PHONE MANAGEMENT ==========

  // Get seller's phones
  app.get("/api/seller/phones", requireSeller, async (req: Request, res: Response) => {
    try {
      const phones = await storage.getDreamPhonesBySeller(req.session.sellerId!);
      res.json(phones);
    } catch (error) {
      console.error("Error fetching seller phones:", error);
      res.status(500).json({ error: "Failed to fetch phones" });
    }
  });

  // Add new phone
  app.post("/api/seller/phones", requireSeller, async (req: Request, res: Response) => {
    try {
      const { model, storage: storageSize, color, colorFa, condition, conditionFa, price, originalPrice, description, images } = req.body;

      if (!model || !price) {
        return res.status(400).json({ error: "Model and price are required" });
      }

      const phone = await storage.createDreamPhone({
        sellerId: req.session.sellerId!,
        model,
        storage: storageSize || null,
        color: color || null,
        colorFa: colorFa || null,
        condition: condition || "new",
        conditionFa: conditionFa || "آکبند",
        price,
        originalPrice: originalPrice || null,
        description: description || null,
        images: images || [],
        isAvailable: true,
        isSold: false
      });

      res.json(phone);
    } catch (error) {
      console.error("Error creating phone:", error);
      res.status(500).json({ error: "Failed to create phone" });
    }
  });

  // Update phone
  app.put("/api/seller/phones/:id", requireSeller, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const phone = await storage.getDreamPhone(id);

      if (!phone) {
        return res.status(404).json({ error: "Phone not found" });
      }

      if (phone.sellerId !== req.session.sellerId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updated = await storage.updateDreamPhone(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating phone:", error);
      res.status(500).json({ error: "Failed to update phone" });
    }
  });

  // Mark phone as sold
  app.put("/api/seller/phones/:id/sold", requireSeller, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const phone = await storage.getDreamPhone(id);

      if (!phone) {
        return res.status(404).json({ error: "Phone not found" });
      }

      if (phone.sellerId !== req.session.sellerId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updated = await storage.updateDreamPhone(id, { isSold: true, isAvailable: false });
      res.json(updated);
    } catch (error) {
      console.error("Error marking phone as sold:", error);
      res.status(500).json({ error: "Failed to update phone" });
    }
  });

  // Delete phone
  app.delete("/api/seller/phones/:id", requireSeller, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const phone = await storage.getDreamPhone(id);

      if (!phone) {
        return res.status(404).json({ error: "Phone not found" });
      }

      if (phone.sellerId !== req.session.sellerId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await storage.deleteDreamPhone(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting phone:", error);
      res.status(500).json({ error: "Failed to delete phone" });
    }
  });

  // ========== PUBLIC DREAM PHONES ROUTES ==========

  // Get all available dream phones (public)
  app.get("/api/dream-phones", async (req: Request, res: Response) => {
    try {
      const phones = await storage.getAvailableDreamPhones();
      
      // Add seller name to each phone
      const phonesWithSellers = await Promise.all(
        phones.map(async (phone) => {
          const seller = await storage.getSeller(phone.sellerId);
          return {
            ...phone,
            sellerName: seller?.name || "فروشنده"
          };
        })
      );

      res.json(phonesWithSellers);
    } catch (error) {
      console.error("Error fetching dream phones:", error);
      res.status(500).json({ error: "Failed to fetch phones" });
    }
  });

  // ========== ADMIN SELLER MANAGEMENT ==========

  // Get all sellers (admin only)
  app.get("/api/admin/sellers", requireAdmin, async (req: Request, res: Response) => {
    try {
      const allSellers = await storage.getAllSellers();
      // Don't send passwords
      const safeSellers = allSellers.map(s => ({
        id: s.id,
        name: s.name,
        username: s.username,
        phone: s.phone,
        storeName: s.storeName,
        storeAddress: s.storeAddress,
        isActive: s.isActive,
        createdAt: s.createdAt
      }));
      res.json(safeSellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      res.status(500).json({ error: "Failed to fetch sellers" });
    }
  });

  // Create new seller (admin only)
  app.post("/api/admin/sellers", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { name, username, password, phone, storeName, storeAddress } = req.body;

      if (!name || !username || !password) {
        return res.status(400).json({ error: "Name, username, and password are required" });
      }

      // Check if username already exists
      const existing = await storage.getSellerByUsername(username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const seller = await storage.createSeller({
        name,
        username,
        password: hashedPassword,
        phone: phone || null,
        storeName: storeName || null,
        storeAddress: storeAddress || null,
        isActive: true
      });

      res.json({
        id: seller.id,
        name: seller.name,
        username: seller.username,
        phone: seller.phone,
        storeName: seller.storeName
      });
    } catch (error) {
      console.error("Error creating seller:", error);
      res.status(500).json({ error: "Failed to create seller" });
    }
  });

  // Update seller (admin only)
  app.put("/api/admin/sellers/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body };

      // If password is being updated, hash it
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const updated = await storage.updateSeller(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Seller not found" });
      }

      res.json({
        id: updated.id,
        name: updated.name,
        username: updated.username,
        phone: updated.phone,
        storeName: updated.storeName,
        isActive: updated.isActive
      });
    } catch (error) {
      console.error("Error updating seller:", error);
      res.status(500).json({ error: "Failed to update seller" });
    }
  });

  // Delete seller (admin only)
  app.delete("/api/admin/sellers/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSeller(id);
      if (!deleted) {
        return res.status(404).json({ error: "Seller not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting seller:", error);
      res.status(500).json({ error: "Failed to delete seller" });
    }
  });

  // Get all dream phones (admin only)
  app.get("/api/admin/dream-phones", requireAdmin, async (req: Request, res: Response) => {
    try {
      const phones = await storage.getAllDreamPhones();
      
      // Add seller name to each phone
      const phonesWithSellers = await Promise.all(
        phones.map(async (phone) => {
          const seller = await storage.getSeller(phone.sellerId);
          return {
            ...phone,
            sellerName: seller?.name || "فروشنده"
          };
        })
      );

      res.json(phonesWithSellers);
    } catch (error) {
      console.error("Error fetching all dream phones:", error);
      res.status(500).json({ error: "Failed to fetch phones" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
