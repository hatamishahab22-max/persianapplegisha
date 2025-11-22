import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronLeft, X } from "lucide-react";
import specsImage from "@assets/photo-output_6_1763703831528.png";

export default function Products() {
  const [showSpecs, setShowSpecs] = useState(false);

  const categories = [
    {
      title: "آیفون",
      description: "جدیدترین مدل‌های آیفون با گارانتی معتبر",
      path: "/category/iphone",
      gradient: "bg-gradient-to-br from-purple-600 via-purple-400 to-blue-400",
      testId: "card-iphone",
      hasSpecs: true
    },
    {
      title: "رجیستری شرکتی",
      description: "آیفون‌های رجیستر شده شرکتی با قیمت ویژه",
      path: "/category/corporate",
      gradient: "bg-gradient-to-br from-orange-600 via-red-500 to-pink-500",
      testId: "card-corporate",
      hasSpecs: false
    },
    {
      title: "آیفون کارکرده",
      description: "گوشی‌های موجود و سفارش مشتری",
      path: "/used-phones",
      gradient: "bg-gradient-to-br from-yellow-600 via-orange-500 to-red-400",
      testId: "card-used-phone",
      hasSpecs: false
    },
    {
      title: "Apple ID Verified",
      description: "Create and manage your verified Apple ID accounts",
      path: "/apple-id-manager",
      gradient: "bg-gradient-to-br from-gray-600 via-slate-500 to-zinc-400",
      testId: "card-appleid",
      hasSpecs: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="p-4">
        <Link href="/">
          <button 
            className="text-white hover:opacity-80 transition-opacity bg-transparent border-0 flex items-center gap-2 p-2"
            data-testid="button-back-home"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-lg">بازگشت</span>
          </button>
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 pb-8" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            محصولات
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <div key={category.path}>
                <Link href={category.path}>
                  <div 
                    className={`${category.gradient} rounded-3xl p-8 flex flex-col justify-between cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      category.hasSpecs ? 'h-72' : 'h-64'
                    }`}
                    data-testid={category.testId}
                  >
                    <div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <div className="w-6 h-6 bg-white/40 rounded-full"></div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        {category.title}
                      </h2>
                      <p className="text-white/90 text-sm md:text-base">
                        {category.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>مشاهده محصولات</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
                
                {category.hasSpecs && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSpecs(true);
                    }}
                    className="w-full mt-3 px-4 py-2 bg-white/10 border border-white/30 rounded-xl hover:bg-white/20 transition-colors text-white text-sm font-bold"
                    data-testid="button-specs"
                  >
                    مشخصات فنی
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSpecs && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="modal-specs">
          <div className="bg-black border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setShowSpecs(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
              data-testid="button-close-specs"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <img
              src={specsImage}
              alt="مشخصات فنی"
              className="w-full h-auto object-contain"
              loading="eager"
              data-testid="img-specs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
