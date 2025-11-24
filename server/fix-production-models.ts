import { db } from "./db";
import { productModels } from "@shared/schema";

async function fixProductionModels() {
  try {
    console.log('Checking iPhone 17 models...');
    
    // Get the iPhone category ID
    const { categories } = await db.raw(
      'SELECT id FROM categories WHERE slug = $1 LIMIT 1',
      ['iphone']
    ) as any;

    if (!categories || categories.length === 0) {
      console.error('iPhone category not found');
      process.exit(1);
    }

    const categoryId = categories[0].id;
    console.log('Found iPhone category:', categoryId);

    // Check if iPhone 17 already exists
    const existing = await db.raw(
      'SELECT COUNT(*) as count FROM product_models WHERE name LIKE $1',
      ['iPhone 17%']
    ) as any;

    if (existing.count > 0) {
      console.log('✅ iPhone 17 models already exist');
      process.exit(0);
    }

    // Add iPhone 17 models
    const models = [
      { name: 'iPhone 17 Pro Max', nameFa: 'iPhone 17 Pro Max', categoryId },
      { name: 'iPhone 17 Pro Max Registry', nameFa: 'iPhone 17 Pro Max رجیستر', categoryId },
      { name: 'iPhone 17 Pro', nameFa: 'iPhone 17 Pro', categoryId },
      { name: 'iPhone 17 Pro Registry', nameFa: 'iPhone 17 Pro رجیستر', categoryId },
      { name: 'iPhone 17', nameFa: 'iPhone 17', categoryId },
      { name: 'iPhone 17 Registry', nameFa: 'iPhone 17 رجیستر', categoryId },
      { name: 'iPhone Air', nameFa: 'iPhone Air', categoryId },
      { name: 'iPhone Air Registry', nameFa: 'iPhone Air رجیستر', categoryId },
    ];

    for (const model of models) {
      await db.insert(productModels).values({
        ...model,
        generation: null,
        order: 0,
        isActive: true,
        createdAt: new Date(),
      });
      console.log(`✅ Added: ${model.name}`);
    }

    console.log('\n🎉 All iPhone 17 models added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProductionModels();
