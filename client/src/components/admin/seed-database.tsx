import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Database, Check, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function SeedDatabase() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setResult(null);

    try {
      const response = await apiRequest('POST', '/api/admin/seed', {});
      setResult(response);
      toast({
        title: "✅ موفق!",
        description: "دیتابیس با موفقیت Seed شد!",
      });
    } catch (error: any) {
      console.error('Seed error:', error);
      toast({
        title: "❌ خطا",
        description: error.message || "خطا در Seed کردن دیتابیس",
        variant: "destructive",
      });
      setResult({ error: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6 p-6" data-testid="page-seed-database" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold">Seed دیتابیس</h1>
        <p className="text-muted-foreground mt-2">
          پر کردن دیتابیس با مدل‌ها، رنگ‌ها و حافظه‌های اولیه
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Seed کردن دیتابیس
          </CardTitle>
          <CardDescription>
            این عملیات تمام مدل‌های آیفون (11 تا 16)، رنگ‌ها و حافظه‌ها رو به دیتابیس اضافه می‌کنه
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <h3 className="font-semibold">📦 چیزهایی که اضافه میشه:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>۳ دسته‌بندی: آیفون، آیپد، ایرپاد</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>۸ رنگ مختلف (مشکی، سفید، نقره‌ای، طلایی و...)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>۴ گزینه حافظه (128GB، 256GB، 512GB، 1TB)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>۲۳ مدل آیفون (از iPhone 11 تا iPhone 16 Pro Max)</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-yellow-800 dark:text-yellow-200">⚠️ توجه:</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  این عملیات فقط یک بار لازمه. اگه قبلاً Seed کردین، نیازی نیست دوباره انجام بدین.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full"
            size="lg"
            data-testid="button-seed-database"
          >
            <Database className="ml-2 h-5 w-5" />
            {isSeeding ? 'در حال Seed کردن...' : 'شروع Seed'}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg ${result.error ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
              {result.error ? (
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-200">خطا:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{result.error}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-semibold text-green-800 dark:text-green-200">✅ موفق!</p>
                    <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <p>دیتابیس با موفقیت Seed شد!</p>
                      {result.stats && (
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          <li>{result.stats.categories} دسته‌بندی</li>
                          <li>{result.stats.colors} رنگ</li>
                          <li>{result.stats.storages} گزینه حافظه</li>
                          <li>{result.stats.models} مدل آیفون</li>
                        </ul>
                      )}
                      <p className="mt-3">✨ حالا می‌تونین برین بخش "مدیریت قیمت‌ها" و قیمت‌ها رو تنظیم کنین!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
