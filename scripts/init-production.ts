import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

async function initProduction() {
  console.log('🚀 Initializing production database...');
  
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql, { schema });

  try {
    // Insert categories
    console.log('Creating categories...');
    const categories = await db.insert(schema.categories).values([
      { name: 'iPhone', nameFa: 'آیفون', slug: 'iphone', order: 1 },
      { name: 'iPad', nameFa: 'آیپد', slug: 'ipad', order: 2 },
      { name: 'AirPods', nameFa: 'ایرپاد', slug: 'airpods', order: 3 },
      { name: 'Used iPhone', nameFa: 'گوشی کارکرده', slug: 'used-iphone', order: 4 },
    ]).returning();

    console.log(`✅ Created ${categories.length} categories`);

    // Find iPhone category
    const iPhoneCategory = categories.find(c => c.slug === 'iphone');
    if (!iPhoneCategory) {
      throw new Error('iPhone category not found');
    }

    // Insert iPhone 17 models
    console.log('Creating iPhone 17 models...');
    const models = await db.insert(schema.productModels).values([
      { categoryId: iPhoneCategory.id, name: 'iPhone 17 Pro Max', nameFa: 'iPhone 17 Pro Max', order: 1 },
      { categoryId: iPhoneCategory.id, name: 'iPhone 17 Pro Max Registry', nameFa: 'iPhone 17 Pro Max رجیستر', order: 2 },
      { categoryId: iPhoneCategory.id, name: 'iPhone 17 Pro', nameFa: 'iPhone 17 Pro', order: 3 },
      { categoryId: iPhoneCategory.id, name: 'iPhone 17 Pro Registry', nameFa: 'iPhone 17 Pro رجیستر', order: 4 },
      { categoryId: iPhoneCategory.id, name: 'iPhone 17', nameFa: 'iPhone 17', order: 5 },
      { categoryId: iPhoneCategory.id, name: 'iPhone 17 Registry', nameFa: 'iPhone 17 رجیستر', order: 6 },
      { categoryId: iPhoneCategory.id, name: 'iPhone Air', nameFa: 'iPhone Air', order: 7 },
      { categoryId: iPhoneCategory.id, name: 'iPhone Air Registry', nameFa: 'iPhone Air رجیستر', order: 8 },
    ]).returning();

    console.log(`✅ Created ${models.length} iPhone models`);

    console.log('\n🎉 Production database initialized successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - iPhone Models: ${models.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

initProduction();
