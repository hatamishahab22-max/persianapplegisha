import { Link, useParams } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import categoryVideo from "@assets/video-output-48494C47-4131-44E2-8B08-AEBB876A23ED-1_1763767507137.mov";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  nameFa: string;
  slug: string;
}

interface ProductModel {
  id: string;
  name: string;
  nameFa: string;
  categoryId: string;
}

interface ProductPrice {
  id: string;
  modelId: string;
  colorId: string;
  storageId: string;
  price: string;
}

export default function Category() {
  const params = useParams();
  const slug = params.slug || "";

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // Fetch all models
  const { data: allModels, isLoading: modelsLoading, error: modelsError } = useQuery<ProductModel[]>({
    queryKey: ['models'],
    queryFn: async () => {
      const response = await fetch('/api/models');
      if (!response.ok) throw new Error('Failed to fetch models');
      return response.json();
    },
  });

  // Fetch all prices to filter models with prices
  const { data: allPrices, isLoading: pricesLoading, error: pricesError } = useQuery<ProductPrice[]>({
    queryKey: ['prices'],
    queryFn: async () => {
      const response = await fetch('/api/product-prices');
      if (!response.ok) throw new Error('Failed to fetch prices');
      return response.json();
    },
  });

  // Find current category
  const currentCategory = categories?.find(cat => cat.slug === slug);
  
  // Get unique model IDs that have prices
  const modelIdsWithPrices = new Set(allPrices?.map(price => price.modelId) || []);
  
  // Filter models for this category AND only those with prices
  const categoryModels = allModels?.filter(model => 
    currentCategory && 
    model.categoryId === currentCategory.id &&
    modelIdsWithPrices.has(model.id)
  ) || [];

  const categoryTitle = currentCategory?.nameFa || "محصولات";

  return (
    <div className="h-screen overflow-hidden relative bg-black" dir="rtl">
      {/* Video Background - Full Screen */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/attached_assets/IMG_6574_1763107623273.jpeg"
      >
        <source src={categoryVideo} type="video/mp4" />
      </video>
      
      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Back Button - Top Left */}
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
        {categoriesLoading || modelsLoading || pricesLoading ? (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-lg text-white">در حال بارگذاری...</p>
          </div>
        ) : categoriesError || modelsError || pricesError ? (
          <div className="text-center">
            <p className="text-2xl text-white font-bold mb-4">خطا در بارگذاری اطلاعات</p>
            <p className="text-white/70">لطفاً دوباره تلاش کنید</p>
          </div>
        ) : categoryModels.length === 0 ? (
          <div className="text-center">
            <p className="text-2xl text-white font-bold">محصولی یافت نشد</p>
          </div>
        ) : (
          <div className="space-y-4 w-full max-w-2xl px-8">
            {categoryModels.map((model, index) => (
              <Link key={model.id} href={`/product/${encodeURIComponent(model.nameFa)}`}>
                <button
                  className="w-full text-center text-white hover:opacity-80 transition-all p-6 cursor-pointer transform hover:scale-105 duration-300"
                  data-testid={`product-item-${index}`}
                >
                  <span className="text-3xl font-bold drop-shadow-lg">{model.nameFa}</span>
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
