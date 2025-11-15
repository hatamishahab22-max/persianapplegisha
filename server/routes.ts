import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';

// Extend Express Request to include session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
    role?: string;
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

  // Auth routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    try {
      // For demo purposes, we'll check hardcoded admin credentials
      // In production, you'd check against database
      if (username === 'admin' && password === 'selena@2523') {
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

      return res.status(401).json({ error: "Invalid username or password" });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: "Login failed" });
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
      const models = await storage.getAllModels();
      res.json(models);
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: "Failed to fetch models" });
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

  const httpServer = createServer(app);

  return httpServer;
}
