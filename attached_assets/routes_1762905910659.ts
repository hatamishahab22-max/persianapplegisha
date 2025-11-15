import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUsedIphoneSchema,
  updateProductPriceSchema,
  insertProductCategorySchema,
  insertProductModelSchema,
  insertProductColorSchema,
  insertProductStorageOptionSchema,
  insertProductPriceSchema,
  insertPageVisitSchema,
} from "@shared/schema";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================================================
  // PRODUCT MANAGEMENT ROUTES
  // ============================================================================

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validated = insertProductCategorySchema.parse(req.body);
      const created = await storage.createCategory(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateCategory(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(400).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Models
  app.get("/api/models", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const models = categoryId 
        ? await storage.getModelsByCategory(categoryId as string)
        : await storage.getAllModels();
      res.json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  app.post("/api/models", async (req, res) => {
    try {
      const validated = insertProductModelSchema.parse(req.body);
      const created = await storage.createModel(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating model:", error);
      res.status(400).json({ error: "Failed to create model" });
    }
  });

  app.patch("/api/models/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateModel(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Model not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating model:", error);
      res.status(400).json({ error: "Failed to update model" });
    }
  });

  app.delete("/api/models/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteModel(id);
      if (!deleted) {
        return res.status(404).json({ error: "Model not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting model:", error);
      res.status(500).json({ error: "Failed to delete model" });
    }
  });

  // Colors
  app.get("/api/colors", async (req, res) => {
    try {
      const { modelId } = req.query;
      const colors = modelId
        ? await storage.getColorsByModel(modelId as string)
        : await storage.getAllColors();
      res.json(colors);
    } catch (error) {
      console.error("Error fetching colors:", error);
      res.status(500).json({ error: "Failed to fetch colors" });
    }
  });

  app.post("/api/colors", async (req, res) => {
    try {
      const validated = insertProductColorSchema.parse(req.body);
      const created = await storage.createColor(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating color:", error);
      res.status(400).json({ error: "Failed to create color" });
    }
  });

  app.patch("/api/colors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateColor(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Color not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating color:", error);
      res.status(400).json({ error: "Failed to update color" });
    }
  });

  app.delete("/api/colors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteColor(id);
      if (!deleted) {
        return res.status(404).json({ error: "Color not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting color:", error);
      res.status(500).json({ error: "Failed to delete color" });
    }
  });

  // Storage Options
  app.get("/api/storage-options", async (req, res) => {
    try {
      const { modelId } = req.query;
      const storageOptions = modelId
        ? await storage.getStorageOptionsByModel(modelId as string)
        : await storage.getAllStorageOptions();
      res.json(storageOptions);
    } catch (error) {
      console.error("Error fetching storage options:", error);
      res.status(500).json({ error: "Failed to fetch storage options" });
    }
  });

  app.post("/api/storage-options", async (req, res) => {
    try {
      const validated = insertProductStorageOptionSchema.parse(req.body);
      const created = await storage.createStorageOption(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating storage option:", error);
      res.status(400).json({ error: "Failed to create storage option" });
    }
  });

  app.patch("/api/storage-options/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateStorageOption(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Storage option not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating storage option:", error);
      res.status(400).json({ error: "Failed to update storage option" });
    }
  });

  app.delete("/api/storage-options/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteStorageOption(id);
      if (!deleted) {
        return res.status(404).json({ error: "Storage option not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting storage option:", error);
      res.status(500).json({ error: "Failed to delete storage option" });
    }
  });

  // Model-Color Associations
  app.post("/api/models/:modelId/colors/:colorId", async (req, res) => {
    try {
      const { modelId, colorId } = req.params;
      const association = await storage.addColorToModel(modelId, colorId);
      res.status(201).json(association);
    } catch (error) {
      console.error("Error adding color to model:", error);
      res.status(400).json({ error: "Failed to add color to model" });
    }
  });

  app.delete("/api/models/:modelId/colors/:colorId", async (req, res) => {
    try {
      const { modelId, colorId } = req.params;
      const deleted = await storage.removeColorFromModel(modelId, colorId);
      if (!deleted) {
        return res.status(404).json({ error: "Association not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error removing color from model:", error);
      res.status(500).json({ error: "Failed to remove color from model" });
    }
  });

  // Model-Storage Associations
  app.post("/api/models/:modelId/storage/:storageId", async (req, res) => {
    try {
      const { modelId, storageId } = req.params;
      const association = await storage.addStorageToModel(modelId, storageId);
      res.status(201).json(association);
    } catch (error) {
      console.error("Error adding storage to model:", error);
      res.status(400).json({ error: "Failed to add storage to model" });
    }
  });

  app.delete("/api/models/:modelId/storage/:storageId", async (req, res) => {
    try {
      const { modelId, storageId } = req.params;
      const deleted = await storage.removeStorageFromModel(modelId, storageId);
      if (!deleted) {
        return res.status(404).json({ error: "Association not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error removing storage from model:", error);
      res.status(500).json({ error: "Failed to remove storage from model" });
    }
  });

  // Product Prices
  app.get("/api/product-prices", async (req, res) => {
    try {
      const prices = await storage.getAllProductPrices();
      res.json(prices);
    } catch (error) {
      console.error("Error fetching product prices:", error);
      res.status(500).json({ error: "Failed to fetch product prices" });
    }
  });

  app.post("/api/product-prices", async (req, res) => {
    try {
      const validated = insertProductPriceSchema.parse(req.body);
      const created = await storage.createProductPrice(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating product price:", error);
      res.status(400).json({ error: "Failed to create product price" });
    }
  });

  app.patch("/api/product-prices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validated = updateProductPriceSchema.parse(req.body);
      const updated = await storage.updateProductPrice(id, validated.price);
      if (!updated) {
        return res.status(404).json({ error: "Product price not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating product price:", error);
      res.status(400).json({ error: "Failed to update product price" });
    }
  });

  app.delete("/api/product-prices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProductPrice(id);
      if (!deleted) {
        return res.status(404).json({ error: "Product price not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product price:", error);
      res.status(500).json({ error: "Failed to delete product price" });
    }
  });

  // ============================================================================
  // USED iPHONES ROUTES
  // ============================================================================

  app.get("/api/used-iphones", async (req, res) => {
    try {
      const usedIphones = await storage.getAllUsedIphones();
      res.json(usedIphones);
    } catch (error) {
      console.error("Error fetching used iPhones:", error);
      res.status(500).json({ error: "Failed to fetch used iPhones" });
    }
  });

  app.post("/api/used-iphones", async (req, res) => {
    try {
      const validated = insertUsedIphoneSchema.parse(req.body);
      const created = await storage.createUsedIphone(validated);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating used iPhone:", error);
      res.status(400).json({ error: "Failed to create used iPhone" });
    }
  });

  app.delete("/api/used-iphones/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteUsedIphone(id);
      if (!deleted) {
        return res.status(404).json({ error: "Used iPhone not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting used iPhone:", error);
      res.status(500).json({ error: "Failed to delete used iPhone" });
    }
  });

  // ============================================================================
  // ADMIN AUTH ROUTES
  // ============================================================================

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      if (!admin || admin.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ success: true, username: admin.username });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ============================================================================
  // ANALYTICS ROUTES
  // ============================================================================

  app.post("/api/visits", async (req, res) => {
    try {
      const validated = insertPageVisitSchema.parse(req.body);
      const visit = await storage.createPageVisit(validated);
      res.status(201).json(visit);
    } catch (error) {
      console.error("Error creating page visit:", error);
      res.status(400).json({ error: "Failed to create page visit" });
    }
  });

  app.get("/api/visits/stats", async (req, res) => {
    try {
      const stats = await storage.getVisitStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching visit stats:", error);
      res.status(500).json({ error: "Failed to fetch visit stats" });
    }
  });

  // ============================================================================
  // CLOUDINARY IMAGE UPLOAD
  // ============================================================================

  app.post("/api/upload", async (req, res) => {
    try {
      const cloudinary = (await import("cloudinary")).v2;
      
      // Check for CLOUDINARY_URL first (recommended), then individual vars
      const cloudinaryUrl = process.env.CLOUDINARY_URL;
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (cloudinaryUrl) {
        // CLOUDINARY_URL is set - use it (format: cloudinary://api_key:api_secret@cloud_name)
        cloudinary.config({
          cloudinary_url: cloudinaryUrl
        });
      } else if (cloudName && apiKey && apiSecret) {
        // Use individual environment variables
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });
      } else {
        console.error("Missing Cloudinary credentials:", {
          cloudinaryUrl: !!cloudinaryUrl,
          cloudName: !!cloudName,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret
        });
        return res.status(503).json({ 
          error: "تنظیمات سرویس ذخیره‌سازی کامل نیست. لطفاً CLOUDINARY_URL را در Environment Variables تنظیم کنید." 
        });
      }

      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "تصویری ارسال نشده است" });
      }

      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "persian-apple-store",
        resource_type: "auto",
      });

      res.json({ 
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id 
      });
    } catch (error: any) {
      console.error("Error uploading to Cloudinary:", error);
      const errorMessage = error?.message || "خطای اپلود عکس";
      res.status(500).json({ error: errorMessage });
    }
  });

  // ============================================================================
  // AI CHAT ROUTE
  // ============================================================================

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return res.status(503).json({ 
          error: "AI service not configured",
          fallback: "متشکرم از سوال شما. لطفاً برای اطلاعات بیشتر با شماره‌های فروشگاه تماس بگیرید: ۰۹۱۲-۱۱۴۹۰۷۹ (شهاب) یا ۰۹۱۲-۶۷۸۲۸۰۹ (شروین)"
        });
      }

      const openai = new OpenAI({ apiKey: openaiKey });

      // Get product context from database
      const [categories, models, colors, storageOptions, usedIphones] = await Promise.all([
        storage.getAllCategories(),
        storage.getAllModels(),
        storage.getAllColors(),
        storage.getAllStorageOptions(),
        storage.getAllUsedIphones(),
      ]);

      const systemPrompt = `شما دستیار هوشمند فروشگاه "پرشین اپل استور گیشا" هستید. 
      
اطلاعات فروشگاه:
- آدرس: تهران، گیشا، بازار بزرگ نصر، ورودی ۴، پلاک ۲۶۱
- تلفن: ۰۲۱-۸۸۲۸۶۷۷۷ و ۰۲۱-۸۸۲۸۷۳۹۳
- موبایل: ۰۹۱۲-۱۱۴۹۰۷۹ (شهاب) و ۰۹۱۲-۶۷۸۲۸۰۹ (شروین)
- ساعت کار: شنبه تا پنجشنبه ۹ صبح تا ۸ شب

دسته‌بندی‌های محصولات موجود: ${categories.map(c => c.nameFa).join('، ')}
مدل‌های موجود: ${models.map(m => m.nameFa).join('، ')}

گوشی‌های کارکرده موجود: ${usedIphones.length > 0 ? usedIphones.map(p => `${p.model} ${p.color} ${p.storage} - ${p.price.toLocaleString()} تومان`).join('، ') : 'در حال حاضر موجود نیست'}

لطفاً به زبان فارسی و به صورت دوستانه و حرفه‌ای پاسخ دهید. برای قیمت‌های دقیق مشتری را به تماس با شماره‌های فروشگاه راهنمایی کنید.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = completion.choices[0]?.message?.content || "متاسفم، نتوانستم پاسخ مناسبی تولید کنم.";
      res.json({ reply });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ 
        error: "Failed to process chat message",
        fallback: "متاسفم، در حال حاضر امکان پاسخگویی وجود ندارد. لطفاً با شماره‌های فروشگاه تماس بگیرید."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
