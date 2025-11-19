import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageTracking } from "@/hooks/use-page-tracking";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const airpodModels = [
  { name: "AirPod 3", nameFA: "ایرپاد ۳" },
  { name: "AirPod 4 with Noise Cancelling", nameFA: "ایرپاد ۴ با نویزکنسلینگ" },
  { name: "AirPod 4 without Noise Cancelling", nameFA: "ایرپاد ۴ بدون نویزکنسلینگ" },
  { name: "AirPod Pro 2", nameFA: "ایرپاد پرو ۲" },
  { name: "AirPod Pro 3", nameFA: "ایرپاد پرو ۳" },
];

export default function AirpodPage() {
  usePageTracking("airpod", "/airpod");
  useScrollToTop();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const handleReset = () => {
    setSelectedModel(null);
  };

  // Step 1: Select Model
  if (!selectedModel) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4" data-testid="link-back-home">
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت به صفحه اصلی
            </Link>
            <h1 className="text-4xl font-semibold mb-2">AirPods</h1>
            <p className="text-muted-foreground">مدل مورد نظر خود را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airpodModels.map((model) => (
              <Card
                key={model.name}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setSelectedModel(model.name)}
                data-testid={`card-model-${model.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">{model.nameFA}</h2>
                  <p className="text-sm text-muted-foreground">{model.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show Price
  const modelInfo = airpodModels.find((m) => m.name === selectedModel);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleReset}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            data-testid="button-back-model"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت
          </button>
        </div>

        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Check className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h1 className="text-3xl font-semibold mb-2">
                {modelInfo?.nameFA}
              </h1>
              <p className="text-muted-foreground">{modelInfo?.name}</p>
            </div>

            <div className="py-6">
              <div className="text-5xl font-semibold font-mono" data-testid="text-price">
                --- تومان
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                (قیمت نهایی پس از تماس اعلام می‌شود)
              </p>
            </div>

            <div className="pt-6 border-t space-y-3">
              <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover-elevate active-elevate-2 h-10 px-8 py-2 min-h-10" data-testid="button-call-to-buy">
                تماس برای خرید
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
                data-testid="button-select-another"
              >
                انتخاب محصول دیگر
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
