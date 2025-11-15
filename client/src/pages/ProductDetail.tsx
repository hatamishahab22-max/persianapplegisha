import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProductDetail() {
  const params = useParams();
  const productName = params.id || "iPhone 16 Pro Max";
  
  // Check if this is AirPods
  const isAirPods = productName.includes("AirPods") || productName.includes("ایرپاد");
  
  const [selectedStorage, setSelectedStorage] = useState<string>(isAirPods ? "N/A" : "");
  const [selectedColor, setSelectedColor] = useState<string>(isAirPods ? "white" : "");
  const [step, setStep] = useState<number>(isAirPods ? 3 : 1);
  
  // Refs for auto-scroll
  const colorSectionRef = useRef<HTMLDivElement>(null);
  const priceSectionRef = useRef<HTMLDivElement>(null);

  // Storage options (not used for AirPods)
  const storageOptions = ["256GB", "512GB", "1TB"];
  
  // Color options based on model
  const getColorOptions = () => {
    if (productName.includes("17 Pro")) {
      return [
        { name: "نارنجی", nameEn: "Orange", value: "orange", color: "#D64218" },
        { name: "سرمه‌ای", nameEn: "Navy", value: "navy", color: "#1E3A5F" },
        { name: "سفید", nameEn: "White", value: "white", color: "#F5F5F5" },
      ];
    } else if (productName.includes("Air")) {
      return [
        { name: "آبی آسمانی", nameEn: "Sky Blue", value: "skyblue", color: "#87CEEB" },
        { name: "سفید", nameEn: "White", value: "white", color: "#F5F5F5" },
        { name: "مشکی", nameEn: "Black", value: "black", color: "#1A1A1A" },
        { name: "طلایی", nameEn: "Gold", value: "gold", color: "#FFD700" },
      ];
    } else if (productName.includes("iPhone 17")) {
      return [
        { name: "اسطوخودوسی", nameEn: "Lavender", value: "lavender", color: "#C8A2D0" },
        { name: "سبز مریمی", nameEn: "Sage", value: "sage", color: "#9CAF88" },
        { name: "آبی", nameEn: "Blue", value: "blue", color: "#4A90E2" },
        { name: "سفید", nameEn: "White", value: "white", color: "#F5F5F5" },
        { name: "مشکی", nameEn: "Black", value: "black", color: "#1A1A1A" },
      ];
    } else {
      return [
        { name: "اسطوخودوسی", nameEn: "Lavender", value: "lavender", color: "#C8A2D0" },
        { name: "سبز مریمی", nameEn: "Sage", value: "sage", color: "#9CAF88" },
        { name: "آبی", nameEn: "Blue", value: "blue", color: "#4A90E2" },
        { name: "سفید", nameEn: "White", value: "white", color: "#F5F5F5" },
        { name: "مشکی", nameEn: "Black", value: "black", color: "#1A1A1A" },
      ];
    }
  };

  const colorOptions = getColorOptions();

  // Price calculation
  const getPriceRange = () => {
    // AirPods fixed prices
    if (isAirPods) {
      const airPodsPrices: Record<string, number> = {
        "AirPods Pro (2nd generation)": 12000000,
        "AirPods Max": 25000000,
        "AirPods (3rd generation)": 8000000,
        "AirPods (2nd generation)": 5000000,
      };
      
      const price = airPodsPrices[productName] || 10000000;
      return price.toLocaleString('fa-IR') + " تومان";
    }
    
    if (!selectedStorage) return "لطفاً حجم را انتخاب کنید";
    
    // Check if this is a corporate registered product
    const isCorporate = productName.includes("رجیستری شرکتی");
    
    const basePrices: Record<string, number> = {
      "256GB": 72000000,
      "512GB": 85000000,
      "1TB": 98000000,
    };
    
    let price = basePrices[selectedStorage] || 0;
    
    // Corporate registered products are 15% cheaper
    if (isCorporate) {
      price = Math.round(price * 0.85);
    }
    
    return price.toLocaleString('fa-IR') + " تومان";
  };

  const handleStorageSelect = (storage: string) => {
    setSelectedStorage(storage);
    setStep(2);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setStep(3);
  };
  
  // Auto-scroll when step changes
  useEffect(() => {
    if (step === 2 && colorSectionRef.current) {
      setTimeout(() => {
        colorSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (step === 3 && priceSectionRef.current) {
      setTimeout(() => {
        priceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [step]);

  return (
    <div className="min-h-screen text-white relative z-0">
      {/* Header */}
      <div className="border-b border-white/20 p-4 bg-black/30 backdrop-blur-sm">
          <Link href={
            isAirPods ? "/category/airpods" :
            productName.includes("رجیستری شرکتی") ? "/category/corporate" : 
            "/category/iphone"
          }>
            <button 
              className="text-white hover:opacity-80 transition-opacity bg-transparent border-0 flex items-center gap-2 p-2"
              data-testid="button-back-category"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-lg">بازگشت</span>
            </button>
          </Link>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Product Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" data-testid="text-product-name">
            {productName}
          </h1>
          {productName.includes("رجیستری شرکتی") ? (
            <div className="space-y-1">
              <p className="text-orange-500 font-bold">✓ رجیستر شده شرکتی</p>
              <p className="text-white/60">قیمت ویژه - محصول اصل</p>
            </div>
          ) : (
            <p className="text-white/60">محصول اصل با گارانتی معتبر</p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-4 mb-12">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-white/20'}`}></div>
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-white/20'}`}></div>
          <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-orange-500' : 'bg-white/20'}`}></div>
        </div>

        {/* Step 1: Storage Selection (Skip for AirPods) */}
        {!isAirPods && step >= 1 && (
          <Card className="bg-white/5 border-white/10 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">۱. انتخاب حجم</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {storageOptions.map((storage) => (
                <button
                  key={storage}
                  onClick={() => handleStorageSelect(storage)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStorage === storage
                      ? 'border-orange-500 bg-orange-500/20'
                      : 'border-white/20 bg-transparent hover:border-white/40'
                  }`}
                  data-testid={`button-storage-${storage}`}
                >
                  <span className="text-lg font-medium text-white">{storage}</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Step 2: Color Selection (Skip for AirPods) */}
        {!isAirPods && step >= 2 && (
          <Card ref={colorSectionRef} className="bg-white/5 border-white/10 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">۲. انتخاب رنگ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-orange-500 bg-orange-500/20'
                      : 'border-white/20 bg-transparent hover:border-white/40'
                  }`}
                  data-testid={`button-color-${color.value}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-white/30"
                      style={{ backgroundColor: color.color }}
                    ></div>
                    <div className="text-center">
                      <span className="text-base font-bold text-white block">{color.name}</span>
                      <span className="text-xs text-white/60">{color.nameEn}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Step 3: Price and Contact */}
        {step >= 3 && (isAirPods || (selectedStorage && selectedColor)) && (
          <Card ref={priceSectionRef} className="bg-gradient-to-br from-orange-600 to-orange-500 border-0 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-white">قیمت نهایی</h2>
              <p className="text-5xl font-bold text-white mb-4" data-testid="text-price">
                {getPriceRange()}
              </p>
              <p className="text-white/90 text-sm">
                {isAirPods ? (
                  `${productName} - سفید`
                ) : (
                  `${productName} - ${selectedStorage} - ${colorOptions.find(c => c.value === selectedColor)?.name} (${colorOptions.find(c => c.value === selectedColor)?.nameEn})`
                )}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white text-center mb-4">
                برای ثبت سفارش با ما تماس بگیرید
              </h3>
              
              <a 
                href="tel:+989121149079"
                className="block"
              >
                <Button 
                  className="w-full bg-white text-orange-600 hover:bg-white/90 h-14 text-lg font-bold"
                  data-testid="button-call-shahab"
                >
                  <Phone className="w-5 h-5 ml-2" />
                  تماس با شهاب: ۰۹۱۲-۱۱۴۹۰۷۹
                </Button>
              </a>
              
              <a 
                href="tel:+989126782809"
                className="block"
              >
                <Button 
                  className="w-full bg-white text-orange-600 hover:bg-white/90 h-14 text-lg font-bold"
                  data-testid="button-call-shervin"
                >
                  <Phone className="w-5 h-5 ml-2" />
                  تماس با شروین: ۰۹۱۲-۶۷۸۲۸۰۹
                </Button>
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
