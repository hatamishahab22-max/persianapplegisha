import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageTracking } from "@/hooks/use-page-tracking";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

type IpadModel = "iPad Air M3" | "iPad Pro M4 11-inch" | "iPad Pro M4 13-inch" | "iPad 11";

const ipadModels: { name: IpadModel; nameFA: string }[] = [
  { name: "iPad Air M3", nameFA: "آیپد ایر M3" },
  { name: "iPad Pro M4 11-inch", nameFA: "آیپد پرو M4 ۱۱ اینچ" },
  { name: "iPad Pro M4 13-inch", nameFA: "آیپد پرو M4 ۱۳ اینچ" },
  { name: "iPad 11", nameFA: "آیپد ۱۱" },
];

const ipadAirColors = [
  { name: "Space Gray", nameFA: "خاکستری", colorClass: "bg-gray-600" },
  { name: "Blue", nameFA: "آبی", colorClass: "bg-blue-500" },
  { name: "Purple", nameFA: "بنفش", colorClass: "bg-purple-500" },
  { name: "Starlight", nameFA: "ستاره‌ای", colorClass: "bg-amber-100" },
];

const ipadProColors = [
  { name: "Space Black", nameFA: "مشکی", colorClass: "bg-gray-900" },
  { name: "Silver", nameFA: "نقره‌ای", colorClass: "bg-gray-200" },
];

const ipad11Colors = [
  { name: "Blue", nameFA: "آبی", colorClass: "bg-blue-500" },
  { name: "Pink", nameFA: "صورتی", colorClass: "bg-pink-400" },
  { name: "Yellow", nameFA: "زرد", colorClass: "bg-yellow-400" },
  { name: "Silver", nameFA: "نقره‌ای", colorClass: "bg-gray-200" },
];

const ipadAirStorages = [
  "128GB Wi-Fi + Cellular",
  "256GB Wi-Fi + Cellular",
  "512GB Wi-Fi + Cellular",
  "1TB Wi-Fi + Cellular",
  "128GB Wi-Fi",
  "256GB Wi-Fi",
  "512GB Wi-Fi",
  "1TB Wi-Fi",
];

const ipadProStorages = [
  "256GB Wi-Fi + Cellular",
  "512GB Wi-Fi + Cellular",
  "1TB Wi-Fi + Cellular",
  "2TB Wi-Fi + Cellular",
  "256GB Wi-Fi",
  "512GB Wi-Fi",
  "1TB Wi-Fi",
  "2TB Wi-Fi",
];

const ipad11Storages = [
  "128GB Wi-Fi + Cellular",
  "256GB Wi-Fi + Cellular",
  "512GB Wi-Fi + Cellular",
  "128GB Wi-Fi",
  "256GB Wi-Fi",
  "512GB Wi-Fi",
];

export default function IpadPage() {
  usePageTracking("ipad", "/ipad");
  useScrollToTop();
  const [model, setModel] = useState<IpadModel | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [storage, setStorage] = useState<string | null>(null);

  const getColors = () => {
    if (!model) return [];
    if (model === "iPad Air M3") return ipadAirColors;
    if (model === "iPad 11") return ipad11Colors;
    return ipadProColors;
  };

  const getStorages = () => {
    if (!model) return [];
    if (model === "iPad Air M3") return ipadAirStorages;
    if (model === "iPad 11") return ipad11Storages;
    return ipadProStorages;
  };

  const handleReset = () => {
    setModel(null);
    setColor(null);
    setStorage(null);
  };

  // Step 1: Select Model
  if (!model) {
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
            <h1 className="text-4xl font-semibold mb-2">iPad</h1>
            <p className="text-muted-foreground">مدل مورد نظر خود را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ipadModels.map((m) => (
              <Card
                key={m.name}
                className="p-8 hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setModel(m.name)}
                data-testid={`card-model-${m.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">{m.nameFA}</h2>
                  <p className="text-sm text-muted-foreground">{m.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Select Color
  if (!color) {
    const colors = getColors();
    
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setModel(null)}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              data-testid="button-back-model"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </button>
            <h1 className="text-4xl font-semibold mb-2">{model}</h1>
            <p className="text-muted-foreground">رنگ را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {colors.map((c) => (
              <Card
                key={c.name}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setColor(c.name)}
                data-testid={`card-color-${c.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${c.colorClass} border-2 border-border shadow-sm`} />
                  <h3 className="text-lg font-medium">{c.nameFA}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Select Storage
  if (!storage) {
    const storages = getStorages();
    
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setColor(null)}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              data-testid="button-back-color"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </button>
            <h1 className="text-4xl font-semibold mb-2">{model} - {color}</h1>
            <p className="text-muted-foreground">ظرفیت و نوع اتصال را انتخاب کنید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storages.map((s) => (
              <Card
                key={s}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setStorage(s)}
                data-testid={`card-storage-${s.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium">{s}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Show Price
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setStorage(null)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            data-testid="button-back-storage"
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
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {model}
              </h1>
              <p className="text-muted-foreground">{color} - {storage}</p>
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
