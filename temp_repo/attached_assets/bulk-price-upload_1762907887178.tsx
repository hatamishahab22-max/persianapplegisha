import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PriceRow {
  model: string;
  color: string;
  storage: string;
  price: number;
}

interface ProductPrice {
  id: string;
  modelId: string;
  colorId: string;
  storageOptionId: string;
  price: number;
}

interface Model {
  id: string;
  nameFa: string;
}

interface Color {
  id: string;
  nameFa: string;
}

interface StorageOption {
  id: string;
  size: string;
}

// Helper function to normalize model names (English → Farsi)
const normalizeModelName = (name: string): string => {
  const normalized = name.trim();
  
  // Map English names to Farsi
  const modelMappings: Record<string, string> = {
    // iPhone 16 series
    "iphone 16 normal": "۱۶ نرمال",
    "iphone 16 pro": "۱۶ پرو",
    "iphone 16 pro max": "۱۶ پرو مکس",
    // iPhone 17 series  
    "iphone 17 pro": "۱۷ پرو",
    "iphone 17 pro max": "۱۷ پرو مکس",
    "iphone 17 air": "۱۷ ایر",
    "iphone 17 normal": "۱۷ نرمال",
    // iPad
    "ipad pro 12.9": "پرو ۱۲.۹",
    "ipad air": "ایر",
    // AirPods
    "airpods 3": "ایرپاد ۳",
    "airpods 4": "ایرپاد ۴ بدون حذف نویز",
    "airpods 4 anc": "ایرپاد ۴ با حذف نویز",
    "airpods pro 2": "ایرپاد پرو ۲",
    "airpods pro 3": "ایرپاد پرو ۳",
  };
  
  const lowerName = normalized.toLowerCase();
  return modelMappings[lowerName] || normalized;
};

// Helper function to normalize color names (English → Farsi)
const normalizeColorName = (name: string): string => {
  const normalized = name.trim();
  
  const colorMappings: Record<string, string> = {
    "desert": "صحرایی",
    "دیزرت": "صحرایی",
    "white": "سفید",
    "سفید": "سفید",
    "black": "مشکی",
    "مشکی": "مشکی",
    "navy": "سرمه‌ای",
    "سرمه ای": "سرمه‌ای",  // بدون نیم‌فاصله
    "سرمه‌ای": "سرمه‌ای",  // با نیم‌فاصله
    "blue": "آبی",
    "آبی": "آبی",
    "purple": "بنفش",
    "بنفش": "بنفش",
    "orange": "نارنجی",
    "نارنجی": "نارنجی",
    "natural": "طبیعی",
    "طبیعی": "طبیعی",
    "silver": "نقره‌ای",
    "نقره ای": "نقره‌ای",  // بدون نیم‌فاصله
    "نقره‌ای": "نقره‌ای",  // با نیم‌فاصله
    "space gray": "خاکستری فضایی",
    "خاکستری فضایی": "خاکستری فضایی",
  };
  
  const lowerName = normalized.toLowerCase();
  return colorMappings[lowerName] || normalized;
};

// Helper function to normalize storage names (English → Farsi)
const normalizeStorageName = (name: string): string => {
  const normalized = name.trim();
  
  if (normalized === "-") return "-";
  
  const storageMappings: Record<string, string> = {
    "128gb": "۱۲۸ گیگابایت",
    "256gb": "۲۵۶ گیگابایت",
    "512gb": "۵۱۲ گیگابایت",
    "1tb": "۱ ترابایت",
    "128gb wi-fi": "۱۲۸ گیگابایت Wi-Fi",
    "256gb wi-fi": "۲۵۶ گیگابایت Wi-Fi",
    "512gb wi-fi": "۵۱۲ گیگابایت Wi-Fi",
    "1tb wi-fi": "۱ ترابایت Wi-Fi",
    "128gb cellular": "۱۲۸ گیگابایت Cellular",
    "256gb cellular": "۲۵۶ گیگابایت Cellular",
    "512gb cellular": "۵۱۲ گیگابایت Cellular",
    "1tb cellular": "۱ ترابایت Cellular",
  };
  
  const lowerName = normalized.toLowerCase();
  return storageMappings[lowerName] || normalized;
};

export default function BulkPriceUpload() {
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: models = [] } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  const { data: colors = [] } = useQuery<Color[]>({
    queryKey: ["/api/colors"],
  });

  const { data: storageOptions = [] } = useQuery<StorageOption[]>({
    queryKey: ["/api/storage-options"],
  });

  const { data: productPrices = [] } = useQuery<ProductPrice[]>({
    queryKey: ["/api/product-prices"],
  });

  const handleDownloadTemplate = () => {
    // Template with both English and Farsi examples
    const csvContent = `نام مدل,رنگ,حافظه,قیمت (تومان)
iPhone 17 Pro Max,orange,256gb,165000000
iPhone 17 Pro Max,navy,256gb,175000000
iPhone 17 Pro Max,white,256gb,185000000
iPhone 17 Pro,navy,256GB,152000000
iPhone 17 Pro,orange,256GB,145000000
iPhone 17 Pro,white,256GB,153000000
iPhone 16 Pro Max,desert,256GB,187000000
iPhone 16 Pro Max,black,256gb,195000000`;

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "price-template.csv";
    link.click();

    toast({
      title: "موفق",
      description: "فایل نمونه دانلود شد",
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      toast({
        title: "خطا",
        description: "فقط فایل‌های CSV مجاز هستند",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadResults(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: async (results) => {
        await processCSVData(results.data as any[]);
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        toast({
          title: "خطا",
          description: "خطا در خواندن فایل CSV",
          variant: "destructive",
        });
        setIsProcessing(false);
      },
    });
  };

  const processCSVData = async (data: any[]) => {
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 because of header and 0-index

      try {
        // Extract data with flexible column names
        const rawModelName = row["نام مدل"] || row["model"] || row["Model"];
        const rawColorName = row["رنگ"] || row["color"] || row["Color"];
        const rawStorageName = row["حافظه"] || row["storage"] || row["Storage"];
        const priceStr = row["قیمت (تومان)"] || row["قیمت"] || row["price"] || row["Price"];

        if (!rawModelName || !rawColorName || !priceStr) {
          errors.push(`سطر ${rowNumber}: داده‌های ناقص`);
          failedCount++;
          continue;
        }

        // Normalize names (supports both English and Farsi, case-insensitive)
        const modelName = normalizeModelName(rawModelName);
        const colorName = normalizeColorName(rawColorName);
        const storageName = rawStorageName ? normalizeStorageName(rawStorageName) : null;

        // Find matching model (case-insensitive)
        const model = models.find(m => 
          m.nameFa.trim().toLowerCase() === modelName.trim().toLowerCase()
        );
        if (!model) {
          errors.push(`سطر ${rowNumber}: مدل "${rawModelName}" یافت نشد (جستجو شد: ${modelName})`);
          failedCount++;
          continue;
        }

        // Find matching color (case-insensitive)
        const color = colors.find(c => 
          c.nameFa.trim().toLowerCase() === colorName.trim().toLowerCase()
        );
        if (!color) {
          errors.push(`سطر ${rowNumber}: رنگ "${rawColorName}" یافت نشد (جستجو شد: ${colorName})`);
          failedCount++;
          continue;
        }

        // Find matching storage (if provided)
        let storageOption = null;
        if (storageName && storageName !== "-") {
          storageOption = storageOptions.find(s => 
            s.size.trim().toLowerCase() === storageName.trim().toLowerCase()
          );
          if (!storageOption) {
            errors.push(`سطر ${rowNumber}: حافظه "${rawStorageName}" یافت نشد (جستجو شد: ${storageName})`);
            failedCount++;
            continue;
          }
        }

        // Parse price
        const price = parseInt(priceStr.toString().replace(/,/g, ""));
        if (isNaN(price)) {
          errors.push(`سطر ${rowNumber}: قیمت نامعتبر`);
          failedCount++;
          continue;
        }

        // Find existing product price
        const existingPrice = productPrices.find(p => 
          p.modelId === model.id &&
          p.colorId === color.id &&
          (!storageOption || p.storageOptionId === storageOption.id)
        );

        if (existingPrice) {
          // Update existing price
          await apiRequest(`/api/product-prices/${existingPrice.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ price }),
          });
          successCount++;
        } else {
          // Create new price entry
          await apiRequest("/api/product-prices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              modelId: model.id,
              colorId: color.id,
              storageOptionId: storageOption?.id || null,
              price,
            }),
          });
          successCount++;
        }
      } catch (error) {
        console.error(`Error processing row ${rowNumber}:`, error);
        errors.push(`سطر ${rowNumber}: خطا در بروزرسانی`);
        failedCount++;
      }
    }

    // Invalidate cache
    await queryClient.invalidateQueries({ queryKey: ["/api/product-prices"] });

    setUploadResults({
      success: successCount,
      failed: failedCount,
      errors: errors.slice(0, 10), // Show max 10 errors
    });

    setIsProcessing(false);

    if (successCount > 0) {
      toast({
        title: "موفق",
        description: `${successCount} قیمت با موفقیت بروزرسانی شد`,
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            آپلود فایل قیمت‌ها
          </CardTitle>
          <CardDescription>
            قیمت‌های محصولات را به صورت دسته‌جمعی بروزرسانی کنید
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="w-full"
              data-testid="button-download-template"
            >
              <Download className="ml-2 h-4 w-4" />
              دانلود فایل نمونه (Template)
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-csv-file"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full"
              data-testid="button-upload-csv"
            >
              <Upload className="ml-2 h-4 w-4" />
              {isProcessing ? "در حال پردازش..." : "انتخاب فایل CSV"}
            </Button>
          </div>

          {uploadResults && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="font-medium">موفق:</span>
                <span className="text-green-600">{uploadResults.success}</span>
              </div>

              {uploadResults.failed > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium">ناموفق:</span>
                  <span className="text-destructive">{uploadResults.failed}</span>
                </div>
              )}

              {uploadResults.errors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">خطاها:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 pr-4">
                    {uploadResults.errors.map((error, index) => (
                      <li key={index} className="list-disc">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>راهنمای استفاده</CardTitle>
          <CardDescription>
            مراحل بروزرسانی دسته‌جمعی قیمت‌ها
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
                1
              </div>
              <div>
                <p className="font-medium">دانلود فایل نمونه</p>
                <p className="text-muted-foreground">
                  فایل Template را دانلود کنید تا فرمت صحیح را ببینید
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
                2
              </div>
              <div>
                <p className="font-medium">ویرایش فایل</p>
                <p className="text-muted-foreground">
                  فایل را با Excel باز کنید و قیمت‌ها را وارد کنید
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
                3
              </div>
              <div>
                <p className="font-medium">ذخیره به عنوان CSV</p>
                <p className="text-muted-foreground">
                  فایل را با فرمت CSV (UTF-8) ذخیره کنید
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
                4
              </div>
              <div>
                <p className="font-medium">آپلود فایل</p>
                <p className="text-muted-foreground">
                  فایل CSV را انتخاب و آپلود کنید
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-xs font-medium">نکات مهم:</p>
            <ul className="text-xs text-muted-foreground space-y-1 pr-4">
              <li className="list-disc">نام مدل: هم انگلیسی (iPhone 17 Pro Max) هم فارسی (۱۷ پرو مکس) قبول است</li>
              <li className="list-disc">رنگ: هم انگلیسی (Desert, White) هم فارسی (صحرایی، سفید) قبول است</li>
              <li className="list-disc">حافظه: هم 256GB هم ۲۵۶ گیگابایت قبول است</li>
              <li className="list-disc">برای محصولاتی که حافظه ندارند (مثل ایرپاد)، "-" بنویسید</li>
              <li className="list-disc">قیمت را به تومان و بدون کاما وارد کنید</li>
              <li className="list-disc">از کدینگ UTF-8 برای ذخیره فایل استفاده کنید</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
