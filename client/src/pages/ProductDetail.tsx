import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowRight, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface ProductDetails {
  model: {
    id: string;
    name: string;
    nameFa: string;
    generation: string | null;
    categoryId: string;
  } | null;
  category: {
    id: string;
    name: string;
    nameFa: string;
  } | null;
  storageOptions: Array<{
    id: string;
    name: string;
    nameFa: string;
  }>;
  colors: Array<{
    id: string;
    name: string;
    nameFa: string;
    hexCode: string;
  }>;
  prices: Array<{
    storageId: string;
    storageName: string;
    colorId: string;
    colorName: string;
    colorHex: string;
    price: string;
    stock: number;
  }>;
}

export default function ProductDetail() {
  const params = useParams();
  const productName = decodeURIComponent(params.id || "");
  
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  
  // Refs for auto-scroll
  const colorSectionRef = useRef<HTMLDivElement>(null);
  const priceSectionRef = useRef<HTMLDivElement>(null);

  // Fetch product details from API
  const { data: productDetails, isLoading, error } = useQuery<ProductDetails>({
    queryKey: ['product-details', productName],
    queryFn: async () => {
      const response = await fetch(`/api/product-details/${encodeURIComponent(productName)}`);
      if (!response.ok) throw new Error('Failed to fetch product details');
      return response.json();
    },
    enabled: !!productName,
  });

  // Auto-select first storage and color when data loads
  useEffect(() => {
    if (productDetails && productDetails.storageOptions.length > 0 && !selectedStorage) {
      setSelectedStorage(productDetails.storageOptions[0].id);
      setStep(2);
    }
  }, [productDetails, selectedStorage]);

  const handleStorageSelect = (storageId: string) => {
    setSelectedStorage(storageId);
    setStep(2);
  };

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
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

  // Get price for selected storage and color
  const getPrice = () => {
    if (!productDetails || !selectedStorage || !selectedColor) {
      return null;
    }
    
    const priceItem = productDetails.prices.find(
      p => p.storageId === selectedStorage && p.colorId === selectedColor
    );
    
    return priceItem ? parseInt(priceItem.price).toLocaleString('fa-IR') + ' تومان' : 'ناموجود';
  };

  // Get selected storage name
  const getStorageName = () => {
    if (!productDetails || !selectedStorage) return '';
    const storage = productDetails.storageOptions.find(s => s.id === selectedStorage);
    return storage?.nameFa || '';
  };

  // Get selected color name
  const getColorName = () => {
    if (!productDetails || !selectedColor) return '';
    const color = productDetails.colors.find(c => c.id === selectedColor);
    return color?.nameFa || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white relative z-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !productDetails || !productDetails.model) {
    return (
      <div className="min-h-screen text-white relative z-0 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">محصول یافت نشد</h2>
          <Link href="/products">
            <Button className="bg-orange-500 hover:bg-orange-600">
              بازگشت به صفحه محصولات
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { model, category, storageOptions, colors } = productDetails;

  return (
    <div className="min-h-screen text-white relative z-0">
      {/* Header */}
      <div className="border-b border-white/20 p-4 bg-black/30 backdrop-blur-sm">
        <Link href={category ? `/category/${category.nameFa}` : "/products"}>
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
            {model.nameFa}
          </h1>
          <p className="text-white/60">محصول اصل با گارانتی معتبر</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-4 mb-12">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-white/20'}`}></div>
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-white/20'}`}></div>
          <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-orange-500' : 'bg-white/20'}`}></div>
        </div>

        {/* Step 1: Storage Selection */}
        {storageOptions.length > 0 && step >= 1 && (
          <Card className="bg-white/5 border-white/10 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">۱. انتخاب حجم</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {storageOptions.map((storage) => (
                <button
                  key={storage.id}
                  onClick={() => handleStorageSelect(storage.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStorage === storage.id
                      ? 'border-orange-500 bg-orange-500/20'
                      : 'border-white/20 bg-transparent hover:border-white/40'
                  }`}
                  data-testid={`button-storage-${storage.id}`}
                >
                  <span className="text-lg font-medium text-white">{storage.nameFa}</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Step 2: Color Selection */}
        {colors.length > 0 && step >= 2 && selectedStorage && (
          <Card ref={colorSectionRef} className="bg-white/5 border-white/10 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">۲. انتخاب رنگ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedColor === color.id
                      ? 'border-orange-500 bg-orange-500/20'
                      : 'border-white/20 bg-transparent hover:border-white/40'
                  }`}
                  data-testid={`button-color-${color.id}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-white/30"
                      style={{ backgroundColor: color.hexCode }}
                    ></div>
                    <div className="text-center">
                      <span className="text-base font-bold text-white block">{color.nameFa}</span>
                      <span className="text-xs text-white/60">{color.name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Step 3: Price and Contact */}
        {step >= 3 && selectedStorage && selectedColor && (
          <Card ref={priceSectionRef} className="bg-gradient-to-br from-orange-600 to-orange-500 border-0 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-white">قیمت نهایی</h2>
              <p className="text-5xl font-bold text-white mb-4" data-testid="text-price">
                {getPrice()}
              </p>
              <p className="text-white/90 text-sm">
                {model.nameFa} - {getStorageName()} - {getColorName()}
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
