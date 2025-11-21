import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Heart, ShoppingCart, Star } from "lucide-react";
import iPhoneBgImage from "@assets/photo-output_1763703622299.png";

interface Product {
  id: number;
  name: string;
  nameFA: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    nameFA: "آیفون ۱۵ پرو مکس",
    price: 2499000,
    rating: 4.8,
    image: "🍎",
    description: "بهترین آیفون با دوربین دو‌فیت‌ و A17 Pro"
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    nameFA: "آیفون ۱۵ پرو",
    price: 1999000,
    rating: 4.7,
    image: "🍎",
    description: "کارایی فوق‌العاده با دیزاین تیتانیومی"
  },
  {
    id: 3,
    name: "iPhone 15",
    nameFA: "آیفون ۱۵",
    price: 1499000,
    rating: 4.6,
    image: "🍎",
    description: "آیفون جدید با بهای مناسب"
  },
  {
    id: 4,
    name: "iPhone 14 Pro",
    nameFA: "آیفون ۱۴ پرو",
    price: 1299000,
    rating: 4.5,
    image: "🍎",
    description: "کارایی بالا با قیمت مناسب"
  }
];

export default function Products() {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen w-full font-['Vazirmatn'] relative" dir="rtl">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${iPhoneBgImage})` }}
      >
        {/* Gradient Overlay for visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">محصولات اپل</h1>
          <Link href="/">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:border-white/40 transition-all overflow-hidden group"
              data-testid={`product-card-${product.id}`}
            >
              {/* Product Image Area */}
              <div className="bg-gradient-to-br from-white/20 to-white/5 p-6 flex items-center justify-center text-6xl h-40 relative overflow-hidden">
                <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <h3 className="text-white font-bold text-lg">{product.nameFA}</h3>
                <p className="text-gray-300 text-sm">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">{product.rating}</span>
                </div>

                {/* Price */}
                <div className="text-[#00ff88] font-bold text-lg" data-testid={`price-${product.id}`}>
                  {product.price.toLocaleString('fa-IR')} تومان
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button 
                    className="flex-1 bg-[#00ff88] text-black font-bold py-2 rounded-lg hover:bg-[#00dd77] transition-colors flex items-center justify-center gap-2"
                    data-testid={`button-add-cart-${product.id}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    خرید
                  </button>
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      wishlist.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    data-testid={`button-wishlist-${product.id}`}
                  >
                    <Heart className="w-4 h-4" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
