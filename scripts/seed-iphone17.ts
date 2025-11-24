import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

async function seedIPhone17() {
  console.log('🚀 Seeding iPhone 17 data...');
  
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql, { schema });

  try {
    // Get iPhone category
    const categories = await db.select().from(schema.categories).where(eq(schema.categories.slug, 'iphone'));
    const iPhoneCategory = categories[0];
    
    if (!iPhoneCategory) {
      throw new Error('iPhone category not found');
    }

    // 1. Add Colors
    console.log('Adding colors...');
    
    // Pro colors
    const proColors = [
      { name: 'Orange', nameFa: 'نارنجی', hexCode: '#FF6B35', order: 1 },
      { name: 'Navy Blue', nameFa: 'سرمه‌ای', hexCode: '#1E3A8A', order: 2 },
      { name: 'White', nameFa: 'سفید', hexCode: '#FFFFFF', order: 3 },
    ];
    
    // Standard colors
    const standardColors = [
      { name: 'Lavender', nameFa: 'بنفش روشن', hexCode: '#E6E6FA', order: 4 },
      { name: 'Sage', nameFa: 'سبز کم‌رنگ', hexCode: '#9DC183', order: 5 },
      { name: 'Black', nameFa: 'مشکی', hexCode: '#000000', order: 7 },
      { name: 'Mist Blue', nameFa: 'آبی مه‌آلود', hexCode: '#A7C7E7', order: 8 },
    ];
    
    // Air colors
    const airColors = [
      { name: 'Space Black', nameFa: 'مشکی فضایی', hexCode: '#1C1C1E', order: 9 },
      { name: 'Sky Blue', nameFa: 'آبی آسمانی', hexCode: '#87CEEB', order: 10 },
      { name: 'Light Gold', nameFa: 'طلایی روشن', hexCode: '#FFD700', order: 12 },
    ];

    const allColors = [...proColors, ...standardColors, ...airColors];
    
    for (const color of allColors) {
      await db.insert(schema.productColors).values(color);
      console.log(`  ✅ ${color.nameFa}`);
    }

    // 2. Add Storage Options
    console.log('Adding storage options...');
    
    const storageOptions = [
      { name: '256GB', nameFa: '۲۵۶ گیگابایت', categoryId: iPhoneCategory.id, order: 1 },
      { name: '512GB', nameFa: '۵۱۲ گیگابایت', categoryId: iPhoneCategory.id, order: 2 },
      { name: '1TB', nameFa: '۱ ترابایت', categoryId: iPhoneCategory.id, order: 3 },
    ];
    
    for (const storage of storageOptions) {
      await db.insert(schema.productStorageOptions).values(storage);
      console.log(`  ✅ ${storage.nameFa}`);
    }

    // Get all added data
    const colors = await db.select().from(schema.productColors);
    const storages = await db.select().from(schema.productStorageOptions);
    const models = await db.select().from(schema.productModels);

    // 3. Add Prices
    console.log('Adding prices...');
    
    // Pro models (256, 512, 1TB + Pro colors)
    const proModels = models.filter(m => 
      m.name.includes('Pro Max') || m.name.includes('Pro') && !m.name.includes('Air')
    );
    const proColorList = colors.filter(c => ['Orange', 'Navy Blue', 'White'].includes(c.name));
    
    for (const model of proModels) {
      for (const storage of storages) {
        for (const color of proColorList) {
          await db.insert(schema.productPrices).values({
            modelId: model.id,
            storageId: storage.id,
            colorId: color.id,
            price: '0', // You'll set prices from admin panel
            stock: 0,
            isActive: true,
          });
        }
      }
    }
    console.log(`  ✅ Pro models prices: ${proModels.length * storages.length * proColorList.length}`);

    // Standard iPhone 17 (256, 512 + Standard colors)
    const standardModels = models.filter(m => 
      m.name === 'iPhone 17' || m.name === 'iPhone 17 Registry'
    );
    const standardColorList = colors.filter(c => 
      ['Lavender', 'Sage', 'White', 'Black', 'Mist Blue'].includes(c.name)
    );
    const standardStorages = storages.filter(s => s.name !== '1TB');
    
    for (const model of standardModels) {
      for (const storage of standardStorages) {
        for (const color of standardColorList) {
          await db.insert(schema.productPrices).values({
            modelId: model.id,
            storageId: storage.id,
            colorId: color.id,
            price: '0',
            stock: 0,
            isActive: true,
          });
        }
      }
    }
    console.log(`  ✅ Standard models prices: ${standardModels.length * standardStorages.length * standardColorList.length}`);

    // iPhone Air (256, 512, 1TB + Air colors)
    const airModels = models.filter(m => m.name.includes('Air'));
    const airColorList = colors.filter(c => 
      ['Space Black', 'Sky Blue', 'White', 'Light Gold'].includes(c.name)
    );
    
    for (const model of airModels) {
      for (const storage of storages) {
        for (const color of airColorList) {
          await db.insert(schema.productPrices).values({
            modelId: model.id,
            storageId: storage.id,
            colorId: color.id,
            price: '0',
            stock: 0,
            isActive: true,
          });
        }
      }
    }
    console.log(`  ✅ Air models prices: ${airModels.length * storages.length * airColorList.length}`);

    console.log('\n🎉 iPhone 17 data seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Colors: ${colors.length}`);
    console.log(`   - Storage Options: ${storages.length}`);
    console.log(`   - Models: ${models.length}`);
    console.log(`   - Price Combinations: ${
      (proModels.length * storages.length * proColorList.length) +
      (standardModels.length * standardStorages.length * standardColorList.length) +
      (airModels.length * storages.length * airColorList.length)
    }`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedIPhone17();
