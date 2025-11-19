import ProductCard from "./ProductCard";
import iphoneImage from "@assets/generated_images/iPhone_16_Pro_hero_image_e2bda205.png";
import productsImage from "@assets/generated_images/Apple_products_collection_5248faa3.png";

//todo: remove mock functionality
const mockProducts = [
  {
    id: "1",
    name: "iPhone 16 Pro",
    nameFa: "آیفون ۱۶ پرو",
    image: iphoneImage,
    price: 85000000,
    colors: ['#000000', '#4A5568', '#CBD5E0', '#F7FAFC'],
    storage: ['128GB', '256GB', '512GB', '1TB'],
    generation: "iPhone 16 Pro",
  },
  {
    id: "2",
    name: "iPhone 16",
    nameFa: "آیفون ۱۶",
    image: productsImage,
    price: 72000000,
    colors: ['#000000', '#1E3A8A', '#DB2777', '#10B981'],
    storage: ['128GB', '256GB', '512GB'],
    generation: "iPhone 16",
  },
  {
    id: "3",
    name: "iPhone 15 Pro Max",
    nameFa: "آیفون ۱۵ پرو مکس",
    image: iphoneImage,
    price: 78000000,
    colors: ['#000000', '#1E40AF', '#78716C'],
    storage: ['256GB', '512GB', '1TB'],
    generation: "iPhone 15 Pro Max",
  },
];

export default function ProductShowcase() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-products-title">
            محصولات جدید
          </h2>
          <p className="text-lg text-muted-foreground">
            جدیدترین مدل‌های آیفون با بهترین قیمت
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
