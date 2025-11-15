import { Link } from "wouter";
import { ArrowRight, ChevronLeft } from "lucide-react";

export default function UsedPhones() {
  const options = [
    {
      title: "آیفون‌های موجود",
      description: "مشاهده گوشی‌های کارکرده موجود در فروشگاه",
      path: "/used-phones/available",
      gradient: "bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-400",
      testId: "card-available"
    },
    {
      title: "سفارش مشتری",
      description: "ثبت سفارش گوشی کارکرده مورد نظر شما",
      path: "/used-phone-order",
      gradient: "bg-gradient-to-br from-orange-600 via-orange-400 to-yellow-400",
      testId: "card-order"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <Link href="/products">
          <button 
            className="text-white hover:opacity-80 transition-opacity bg-transparent border-0 flex items-center gap-2 p-2"
            data-testid="button-back-products"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-lg">بازگشت</span>
          </button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center px-4 pb-8" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            آیفون کارکرده
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {options.map((option) => (
              <Link key={option.path} href={option.path}>
                <div 
                  className={`${option.gradient} rounded-3xl p-8 h-64 flex flex-col justify-between cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                  data-testid={option.testId}
                >
                  <div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                      <div className="w-6 h-6 bg-white/40 rounded-full"></div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      {option.title}
                    </h2>
                    <p className="text-white/90 text-sm md:text-base">
                      {option.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>ادامه</span>
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
