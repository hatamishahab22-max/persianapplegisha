import { db } from "./db";
import { productModels, productColors, productStorageOptions, productPrices } from "@shared/schema";
import { eq } from "drizzle-orm";

async function addIPhone17Models() {
  try {
    console.log('Getting iPhone category...');
    
    // Get iPhone category
    const categories = await db.select().from(productModels).limit(1);
    if (categories.length === 0) {
      console.log('No models found, cannot determine category');
      process.exit(1);
    }
    
    const categoryId = categories[0].categoryId;
    console.log('iPhone category ID:', categoryId);

    // Check if models already exist
    const existingModels = await db.select().from(productModels).where(
      eq(productModels.name, 'iPhone 17 Pro Max')
    );

    if (existingModels.length > 0) {
      console.log('✅ iPhone 17 models already exist in database');
      process.exit(0);
    }

    console.log('Creating iPhone 17 models...');
    
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
      console.log(`✅ Created: ${model.name}`);
    }

    console.log('\n🎉 All iPhone 17 models added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addIPhone17Models();
