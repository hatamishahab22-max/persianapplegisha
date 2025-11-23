import { Link, useParams } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import iphoneBackground from "@assets/Xxccvb_1763855043586.png";
import { useQuery } from "@tanstack/react-query";

interface ProductModel {
  id: string;
  name: string;
  nameFa: string;
}

export default function Category() {
  const params = useParams();
  const slug = params.slug || "";

  // Handle both /category/iphone and /category/رجیستری شرکتی (exact match)
  const isIphoneCategory = slug === "iphone" || slug === "رجیستری شرکتی";
  const isAirpodsCategory = slug === "airpods";
  const categoryTitle = isIphoneCategory ? "iPhone" : isAirpodsCategory ? "ایرپاد" : "محصولات";

  // iPhone category uses hardcoded 8 models
  const iphoneModels = [
    { nameFa: "iPhone 17 Pro Max", nameEn: "iPhone 17 Pro Max" },
    { nameFa: "iPhone 17 Pro Max رجیستر", nameEn: "iPhone 17 Pro Max Registry" },
    { nameFa: "iPhone 17 Pro", nameEn: "iPhone 17 Pro" },
    { nameFa: "iPhone 17 Pro رجیستر", nameEn: "iPhone 17 Pro Registry" },
    { nameFa: "iPhone 17", nameEn: "iPhone 17" },
    { nameFa: "iPhone 17 رجیستر", nameEn: "iPhone 17 Registry" },
    { nameFa: "iPhone Air", nameEn: "iPhone Air" },
    { nameFa: "iPhone Air رجیستر", nameEn: "iPhone Air Registry" }
  ];

  // For non-iPhone categories, fetch models from API
  const { data: allModels, isLoading: modelsLoading } = useQuery<ProductModel[]>({
    queryKey: ['category-models'],
    queryFn: async () => {
      const response = await fetch('/api/models');
      if (!response.ok) throw new Error('Failed to fetch models');
      return response.json();
    },
    enabled: !isIphoneCategory
  });

  // Filter models for AirPods
  const airpodsModels = allModels?.filter(m => 
    m.nameFa.includes("ایرپاد") || m.name.toLowerCase().includes("airpod")
  ) || [];

  return (
    <div className="h-screen overflow-hidden relative bg-black" dir="rtl">
      {/* Background Image for iPhone, Black for others */}
      {isIphoneCategory ? (
        <img 
          src={iphoneBackground} 
          alt="iPhone Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-black"></div>
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Back Button - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <Link href="/products">
          <button 
            className="text-white hover:opacity-80 transition-opacity bg-black/30 backdrop-blur-md border-0 flex items-center gap-2 px-4 py-2 rounded-lg"
            data-testid="button-back-products"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-lg">بازگشت</span>
          </button>
        </Link>
      </div>

      {/* Category Title - Top Center */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-white text-5xl font-bold drop-shadow-lg">
          {categoryTitle}
        </h1>
      </div>

      {/* Product List - Center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {isIphoneCategory ? (
          <div className="space-y-3 w-full max-w-2xl px-8">
            {iphoneModels.map((model, index) => (
              <Link key={index} href={`/product/${encodeURIComponent(model.nameFa)}`}>
                <button
                  className="w-full text-center text-white hover:opacity-80 transition-all p-5 cursor-pointer transform hover:scale-105 duration-300 bg-black/50 rounded-lg"
                  data-testid={`product-item-${index}`}
                >
                  <div className="text-2xl md:text-3xl font-bold drop-shadow-lg">{model.nameFa}</div>
                </button>
              </Link>
            ))}
          </div>
        ) : isAirpodsCategory ? (
          modelsLoading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
              <p className="text-lg text-white">در حال بارگذاری...</p>
            </div>
          ) : airpodsModels.length === 0 ? (
            <div className="text-center">
              <p className="text-2xl text-white font-bold">محصولی یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-3 w-full max-w-2xl px-8">
              {airpodsModels.map((model, index) => (
                <Link key={model.id} href={`/product/${encodeURIComponent(model.nameFa)}`}>
                  <button
                    className="w-full text-center text-white hover:opacity-80 transition-all p-5 cursor-pointer transform hover:scale-105 duration-300 bg-black/50 rounded-lg"
                    data-testid={`product-item-${index}`}
                  >
                    <div className="text-2xl md:text-3xl font-bold drop-shadow-lg">{model.nameFa}</div>
                  </button>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center">
            <p className="text-2xl text-white font-bold">محصولی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}
