import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageTracking } from "@/hooks/use-page-tracking";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import type { ProductModel, ProductColor, ProductStorageOption, ProductPrice } from "@shared/schema";

export default function IphonePage() {
  usePageTracking("iphone", "/iphone");
  useScrollToTop();
  const [generation, setGeneration] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<ProductStorageOption | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

  // Fetch iPhone category models
  const { data: allModels = [] } = useQuery<ProductModel[]>({
    queryKey: ["/api/models"],
  });

  // Filter iPhone models only
  const iphoneModels = allModels.filter((m) => 
    m.generation?.includes("iPhone")
  );

  // Get unique generations
  const generations = Array.from(new Set(iphoneModels.map((m) => m.generation).filter(Boolean)));

  // Filter models by selected generation
  const generationModels = generation 
    ? iphoneModels.filter((m) => m.generation === generation)
    : [];

  // Fetch colors for selected model
  const { data: modelColors = [] } = useQuery<ProductColor[]>({
    queryKey: ["/api/colors", { modelId: selectedModel?.id }],
    queryFn: async () => {
      if (!selectedModel) return [];
      const response = await fetch(`/api/colors?modelId=${selectedModel.id}`);
      if (!response.ok) throw new Error("Failed to fetch colors");
      return response.json();
    },
    enabled: !!selectedModel,
  });

  // Fetch storage options for selected model
  const { data: modelStorageOptions = [] } = useQuery<ProductStorageOption[]>({
    queryKey: ["/api/storage-options", { modelId: selectedModel?.id }],
    queryFn: async () => {
      if (!selectedModel) return [];
      const response = await fetch(`/api/storage-options?modelId=${selectedModel.id}`);
      if (!response.ok) throw new Error("Failed to fetch storage options");
      return response.json();
    },
    enabled: !!selectedModel,
  });

  // Fetch price for selected combination
  const { data: allPrices = [] } = useQuery<ProductPrice[]>({
    queryKey: ["/api/product-prices"],
  });

  const selectedPrice = allPrices.find(
    (p) =>
      p.modelId === selectedModel?.id &&
      p.storageId === selectedStorage?.id &&
      p.colorId === selectedColor?.id
  );

  const handleReset = () => {
    setGeneration(null);
    setSelectedModel(null);
    setSelectedStorage(null);
    setSelectedColor(null);
  };

  // Step 1: Select Generation
  if (!generation) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4" data-testid="link-back-home">
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به صفحه اصلی
              </a>
            </Link>
            <h1 className="text-4xl font-semibold mb-2">iPhone</h1>
            <p className="text-muted-foreground">نسل مورد نظر خود را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generations.sort().map((gen) => {
              const genNumber = gen?.replace("iPhone ", "");
              return (
                <Card
                  key={gen}
                  className="p-8 hover-elevate active-elevate-2 cursor-pointer transition-all"
                  onClick={() => setGeneration(gen || "")}
                  data-testid={`card-iphone-${genNumber}`}
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-semibold mb-4">{gen}</h2>
                    <p className="text-muted-foreground">
                      {generationModels.length} مدل موجود
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Select Model
  if (!selectedModel) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={handleReset}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              data-testid="button-back-generation"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </button>
            <h1 className="text-4xl font-semibold mb-2">{generation}</h1>
            <p className="text-muted-foreground">مدل را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generationModels.map((model) => (
              <Card
                key={model.id}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setSelectedModel(model)}
                data-testid={`card-model-${model.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{model.nameFa}</h3>
                  <p className="text-sm text-muted-foreground">{model.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Select Storage
  if (!selectedStorage) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setSelectedModel(null)}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              data-testid="button-back-model"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </button>
            <h1 className="text-4xl font-semibold mb-2">{selectedModel.nameFa}</h1>
            <p className="text-muted-foreground">حجم حافظه را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {modelStorageOptions.map((storage) => (
              <Card
                key={storage.id}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setSelectedStorage(storage)}
                data-testid={`card-storage-${storage.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">{storage.name}</h3>
                  <p className="text-sm text-muted-foreground">{storage.nameFa}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Select Color
  if (!selectedColor) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setSelectedStorage(null)}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              data-testid="button-back-storage"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </button>
            <h1 className="text-4xl font-semibold mb-2">
              {selectedModel.nameFa} {selectedStorage.name}
            </h1>
            <p className="text-muted-foreground">رنگ را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {modelColors.map((color) => (
              <Card
                key={color.id}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setSelectedColor(color)}
                data-testid={`card-color-${color.name.toLowerCase()}`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-border shadow-sm"
                    style={{ backgroundColor: color.hexCode || "#cccccc" }}
                  />
                  <h3 className="text-lg font-medium">{color.nameFa}</h3>
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Show Price
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setSelectedColor(null)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            data-testid="button-back-color"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت
          </button>
        </div>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold mb-2">انتخاب شما</h1>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">مدل:</span>
              <span className="font-semibold">{selectedModel.nameFa}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">حجم حافظه:</span>
              <span className="font-semibold">{selectedStorage.nameFa}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-muted-foreground">رنگ:</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-border"
                  style={{ backgroundColor: selectedColor.hexCode || "#cccccc" }}
                />
                <span className="font-semibold">{selectedColor.nameFa}</span>
              </div>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-muted-foreground">قیمت:</span>
              <span className="text-2xl font-bold">
                {selectedPrice && selectedPrice.price > 0
                  ? `${selectedPrice.price.toLocaleString("fa-IR")} تومان`
                  : "--- تومان"}
              </span>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg text-center mb-6">
            <p className="text-sm text-muted-foreground">
              قیمت‌ها حدودی است، برای قیمت دقیق تماس بگیرید
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a href="tel:02188286777">
              <Button className="w-full" size="lg" data-testid="button-call-store">
                تماس با فروشگاه
              </Button>
            </a>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReset}
              data-testid="button-select-another"
            >
              انتخاب مدل دیگر
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
