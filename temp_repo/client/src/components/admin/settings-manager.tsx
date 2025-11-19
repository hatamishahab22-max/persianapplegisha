import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, RefreshCw, Loader2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  setBackgroundImage, 
  getBackgroundImage, 
  type BackgroundCategory 
} from "@/hooks/use-background-image";

const DEFAULT_BG = '/attached_assets/IMG_6628_1763162465034.jpeg';

const CATEGORIES: { value: BackgroundCategory; label: string; labelEn: string }[] = [
  { value: 'iphone', label: 'آیفون', labelEn: 'iPhone' },
  { value: 'ipad', label: 'آیپد', labelEn: 'iPad' },
  { value: 'airpods', label: 'ایرپاد', labelEn: 'AirPods' },
  { value: 'used', label: 'گوشی کارکرده', labelEn: 'Used Phones' },
  { value: 'default', label: 'پیش‌فرض', labelEn: 'Default' },
];

function BackgroundEditor({ category, label }: { category: BackgroundCategory; label: string }) {
  const { toast } = useToast();
  const [backgroundUrl, setBackgroundUrl] = useState(() => getBackgroundImage(category));
  const [tempUrl, setTempUrl] = useState(backgroundUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setBackgroundImage(category, tempUrl);
    setBackgroundUrl(tempUrl);
    toast({
      title: "تنظیمات ذخیره شد",
      description: `عکس بک‌گراند ${label} اعمال شد.`,
    });
  };

  const handleReset = () => {
    setTempUrl(DEFAULT_BG);
    setBackgroundImage(category, DEFAULT_BG);
    setBackgroundUrl(DEFAULT_BG);
    toast({
      title: "بازگشت به تنظیمات پیش‌فرض",
      description: `عکس بک‌گراند ${label} به حالت اولیه بازگشت.`,
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const base64Image = await convertToBase64(file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(`آپلود ناموفق: ${response.status}`);
      }

      const data = await response.json();
      setTempUrl(data.url);

      toast({
        title: "عکس آپلود شد",
        description: "روی دکمه 'ذخیره تغییرات' کلیک کنید تا اعمال شود.",
      });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطا در آپلود عکس",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Background Preview */}
      <div>
        <Label>پیش‌نمایش فعلی</Label>
        <div 
          className="mt-2 w-full h-48 rounded-lg bg-cover bg-center border-2 border-muted"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      </div>

      {/* Upload New Image */}
      <div>
        <Label>آپلود عکس جدید</Label>
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
            data-testid={`button-upload-background-${category}`}
          >
            {isUploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال آپلود...
              </>
            ) : (
              <>
                <Upload className="ml-2 h-4 w-4" />
                انتخاب و آپلود عکس
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          یا آدرس عکس را مستقیماً وارد کنید
        </p>
      </div>

      {/* Manual URL Input */}
      <div>
        <Label>آدرس عکس (URL)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            dir="ltr"
            className="text-left"
            data-testid={`input-background-url-${category}`}
          />
        </div>
      </div>

      {/* Preview New Background */}
      {tempUrl !== backgroundUrl && (
        <div>
          <Label>پیش‌نمایش جدید</Label>
          <div 
            className="mt-2 w-full h-48 rounded-lg bg-cover bg-center border-2 border-orange-500"
            style={{ backgroundImage: `url(${tempUrl})` }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          onClick={handleSave}
          disabled={tempUrl === backgroundUrl}
          data-testid={`button-save-settings-${category}`}
        >
          <Upload className="w-4 h-4 ml-2" />
          ذخیره تغییرات
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          data-testid={`button-reset-settings-${category}`}
        >
          <RefreshCw className="w-4 h-4 ml-2" />
          بازگشت به پیش‌فرض
        </Button>
      </div>
    </div>
  );
}

export default function SettingsManager() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">تنظیمات فروشگاه</h2>
        <p className="text-muted-foreground mt-1">مدیریت تنظیمات عمومی و ظاهر فروشگاه</p>
      </div>

      {/* Background Image Settings */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" />
          عکس بک‌گراند صفحات
        </h3>
        
        <Tabs defaultValue="iphone" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {CATEGORIES.map(cat => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {CATEGORIES.map(cat => (
            <TabsContent key={cat.value} value={cat.value}>
              <BackgroundEditor category={cat.value} label={cat.label} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900 mt-6">
          <p className="text-sm font-semibold mb-2">راهنما:</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>برای هر دسته محصول میتوانید عکس بک‌گراند جداگانه تنظیم کنید</li>
            <li>میتوانید عکس جدیدی آپلود کنید یا آدرس عکسی از اینترنت را وارد کنید</li>
            <li>عکس بک‌گراند به صورت خودکار و بدون تاخیر بین صفحات تغییر میکند</li>
            <li>برای برگشت به عکس پیش‌فرض، روی "بازگشت به پیش‌فرض" کلیک کنید</li>
          </ul>
        </div>
      </Card>

      {/* Additional Settings Placeholder */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">تنظیمات بیشتر</h3>
        <p className="text-muted-foreground">تنظیمات بیشتر در آینده اضافه خواهد شد...</p>
      </Card>
    </div>
  );
}
