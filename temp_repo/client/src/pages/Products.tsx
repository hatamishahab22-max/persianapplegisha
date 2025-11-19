import { Link } from "wouter";
import { ArrowRight, ChevronLeft } from "lucide-react";

export default function Products() {
  const categories = [
    {
      title: "آیفون",
      description: "جدیدترین مدل‌های آیفون با گارانتی معتبر",
      path: "/category/iphone",
      gradient: "bg-gradient-to-br from-purple-600 via-purple-400 to-blue-400",
      testId: "card-iphone"
    },
    {
      title: "رجیستری شرکتی",
      description: "آیفون‌های رجیستر شده شرکتی با قیمت ویژه",
      path: "/category/corporate",
      gradient: "bg-gradient-to-br from-orange-600 via-red-500 to-pink-500",
      testId: "card-corporate"
    },
    {
      title: "آیفون کارکرده",
      description: "گوشی‌های موجود و سفارش مشتری",
      path: "/used-phones",
      gradient: "bg-gradient-to-br from-yellow-600 via-orange-500 to-red-400",
      testId: "card-used-phone"
    },
    {
      title: "آیپد",
      description: "تبلت‌های قدرتمند اپل برای کار و سرگرمی",
      path: "/category/ipad",
      gradient: "bg-gradient-to-br from-green-500 via-emerald-400 to-yellow-300",
      testId: "card-ipad"
    },
    {
      title: "ایرپاد",
      description: "تجربه صدای بی‌نظیر با هدفون‌های اپل",
      path: "/category/airpods",
      gradient: "bg-gradient-to-br from-blue-600 via-cyan-400 to-teal-300",
      testId: "card-airpods"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
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

      {/* Content */}
      <div className="flex items-center justify-center px-4 pb-8" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            محصولات
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link key={category.path} href={category.path}>
                <div 
                  className={`${category.gradient} rounded-3xl p-8 h-64 flex flex-col justify-between cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
