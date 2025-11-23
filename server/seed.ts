import { storage } from './storage.js';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. Create Categories
    console.log('Creating categories...');
    const iphoneCategory = await storage.createCategory({ 
      name: 'iPhone',
      nameFa: 'آیفون',
      slug: 'iphone' 
    });
    const ipadCategory = await storage.createCategory({ 
      name: 'iPad',
      nameFa: 'آیپد',
      slug: 'ipad' 
    });
    const airpodsCategory = await storage.createCategory({ 
      name: 'AirPods',
      nameFa: 'ایرپاد',
      slug: 'airpods' 
    });
    const usedCategory = await storage.createCategory({ 
      name: 'Used iPhones',
      nameFa: 'آیفون‌های کارکرده', 
      slug: 'used-iphones' 
    });
    console.log('✅ Categories created');

    // 2. Create Colors
    console.log('Creating colors...');
    const colors = [
      { name: 'Black', nameFa: 'مشکی', hexCode: '#000000' },
      { name: 'White', nameFa: 'سفید', hexCode: '#FFFFFF' },
      { name: 'Silver', nameFa: 'نقره‌ای', hexCode: '#C0C0C0' },
      { name: 'Gold', nameFa: 'طلایی', hexCode: '#FFD700' },
      { name: 'Blue', nameFa: 'آبی', hexCode: '#1E90FF' },
      { name: 'Pink', nameFa: 'صورتی', hexCode: '#FFB6C1' },
      { name: 'Purple', nameFa: 'بنفش', hexCode: '#800080' },
      { name: 'Red', nameFa: 'قرمز', hexCode: '#FF0000' },
      { name: 'Green', nameFa: 'سبز', hexCode: '#00FF00' },
      { name: 'Yellow', nameFa: 'زرد', hexCode: '#FFFF00' },
      { name: 'Sky Blue', nameFa: 'آبی آسمانی', hexCode: '#87CEEB' },
      { name: 'Orange', nameFa: 'نارنجی', hexCode: '#FFA500' },
      { name: 'Natural Titanium', nameFa: 'تیتانیوم طبیعی', hexCode: '#8B8680' }
    ];
    
    for (const color of colors) {
      await storage.createColor(color);
    }
    console.log('✅ Colors created');

    // 3. Create Storage Options
    console.log('Creating storage options...');
    const storageOptions = [
      { name: '128GB', nameFa: '۱۲۸ گیگابایت' },
      { name: '256GB', nameFa: '۲۵۶ گیگابایت' },
      { name: '512GB', nameFa: '۵۱۲ گیگابایت' },
      { name: '1TB', nameFa: '۱ ترابایت' },
      { name: '2TB', nameFa: '۲ ترابایت' }
    ];
    for (const storage of storageOptions) {
      await storage.createStorageOption(storage);
    }
    console.log('✅ Storage options created');

    // 4. Create iPhone Models
    console.log('Creating iPhone models...');
    const iphoneModels = [
      // iPhone 17 Series
      { name: 'iPhone 17 Pro Max', nameFa: 'iPhone 17 Pro Max', categoryId: iphoneCategory.id },
      { name: 'iPhone 17 Pro Max Registry', nameFa: 'iPhone 17 Pro Max رجیستر', categoryId: iphoneCategory.id },
      { name: 'iPhone 17 Pro', nameFa: 'iPhone 17 Pro', categoryId: iphoneCategory.id },
      { name: 'iPhone 17 Pro Registry', nameFa: 'iPhone 17 Pro رجیستر', categoryId: iphoneCategory.id },
      { name: 'iPhone 17', nameFa: 'iPhone 17', categoryId: iphoneCategory.id },
      { name: 'iPhone 17 Registry', nameFa: 'iPhone 17 رجیستر', categoryId: iphoneCategory.id },
      { name: 'iPhone Air', nameFa: 'iPhone Air', categoryId: iphoneCategory.id },
      { name: 'iPhone Air Registry', nameFa: 'iPhone Air رجیستر', categoryId: iphoneCategory.id },
      
      // iPhone 16 Series
      { name: 'iPhone 16', nameFa: 'آیفون ۱۶', categoryId: iphoneCategory.id },
      { name: 'iPhone 16 Plus', nameFa: 'آیفون ۱۶ پلاس', categoryId: iphoneCategory.id },
      { name: 'iPhone 16 Pro', nameFa: 'آیفون ۱۶ پرو', categoryId: iphoneCategory.id },
      { name: 'iPhone 16 Pro Max', nameFa: 'آیفون ۱۶ پرو مکس', categoryId: iphoneCategory.id },
      
      // iPhone 15 Series
      { name: 'iPhone 15', nameFa: 'آیفون ۱۵', categoryId: iphoneCategory.id },
      { name: 'iPhone 15 Plus', nameFa: 'آیفون ۱۵ پلاس', categoryId: iphoneCategory.id },
      { name: 'iPhone 15 Pro', nameFa: 'آیفون ۱۵ پرو', categoryId: iphoneCategory.id },
      { name: 'iPhone 15 Pro Max', nameFa: 'آیفون ۱۵ پرو مکس', categoryId: iphoneCategory.id },
      
      // iPhone 14 Series
      { name: 'iPhone 14', nameFa: 'آیفون ۱۴', categoryId: iphoneCategory.id },
      { name: 'iPhone 14 Plus', nameFa: 'آیفون ۱۴ پلاس', categoryId: iphoneCategory.id },
      { name: 'iPhone 14 Pro', nameFa: 'آیفون ۱۴ پرو', categoryId: iphoneCategory.id },
      { name: 'iPhone 14 Pro Max', nameFa: 'آیفون ۱۴ پرو مکس', categoryId: iphoneCategory.id },
      
      // iPhone 13 Series
      { name: 'iPhone 13', nameFa: 'آیفون ۱۳', categoryId: iphoneCategory.id },
      { name: 'iPhone 13 mini', nameFa: 'آیفون ۱۳ مینی', categoryId: iphoneCategory.id },
      { name: 'iPhone 13 Pro', nameFa: 'آیفون ۱۳ پرو', categoryId: iphoneCategory.id },
      { name: 'iPhone 13 Pro Max', nameFa: 'آیفون ۱۳ پرو مکس', categoryId: iphoneCategory.id },
      
      // iPhone 12 Series
      { name: 'iPhone 12', nameFa: 'آیفون ۱۲', categoryId: iphoneCategory.id },
      { name: 'iPhone 12 mini', nameFa: 'آیفون ۱۲ مینی', categoryId: iphoneCategory.id },
      { name: 'iPhone 12 Pro', nameFa: 'آیفون ۱۲ پرو', categoryId: iphoneCategory.id },
      { name: 'iPhone 12 Pro Max', nameFa: 'آیفون ۱۲ پرو مکس', categoryId: iphoneCategory.id },
      
      // iPhone 11 Series
      { name: 'iPhone 11', nameFa: 'آیفون ۱۱', categoryId: iphoneCategory.id },
      { name: 'iPhone 11 Pro', nameFa: 'آیفون ۱۱ پرو', categoryId: iphoneCategory.id },
      { name: 'iPhone 11 Pro Max', nameFa: 'آیفون ۱۱ پرو مکس', categoryId: iphoneCategory.id },
    ];

    for (const model of iphoneModels) {
      await storage.createModel(model);
    }
    console.log('✅ iPhone models created');

    // 5. Create iPad Models
    console.log('Creating iPad models...');
    const ipadModels = [
      { name: 'iPad Pro 12.9"', nameFa: 'آیپد پرو ۱۲.۹', categoryId: ipadCategory.id },
      { name: 'iPad Pro 11"', nameFa: 'آیپد پرو ۱۱', categoryId: ipadCategory.id },
      { name: 'iPad Air', nameFa: 'آیپد ایر', categoryId: ipadCategory.id },
      { name: 'iPad', nameFa: 'آیپد', categoryId: ipadCategory.id },
      { name: 'iPad mini', nameFa: 'آیپد مینی', categoryId: ipadCategory.id },
    ];

    for (const model of ipadModels) {
      await storage.createModel(model);
    }
    console.log('✅ iPad models created');

    // 6. Create AirPods Models
    console.log('Creating AirPods models...');
    const airpodsModels = [
      { name: 'AirPods Pro 2', nameFa: 'ایرپاد پرو ۲', categoryId: airpodsCategory.id },
      { name: 'AirPods 3', nameFa: 'ایرپاد ۳', categoryId: airpodsCategory.id },
      { name: 'AirPods 2', nameFa: 'ایرپاد ۲', categoryId: airpodsCategory.id },
      { name: 'AirPods Max', nameFa: 'ایرپاد مکس', categoryId: airpodsCategory.id },
    ];

    for (const model of airpodsModels) {
      await storage.createModel(model);
    }
    console.log('✅ AirPods models created');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${colors.length}`);
    console.log(`- Colors: ${colors.length}`);
    console.log(`- Storage Options: ${storageOptions.length}`);
    console.log(`- iPhone Models: ${iphoneModels.length}`);
    console.log(`- iPad Models: ${ipadModels.length}`);
    console.log(`- AirPods Models: ${airpodsModels.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log('✅ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export { seed };
