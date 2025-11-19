import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUploadWithUrlProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export default function ImageUploadWithUrl({ 
  onImageUploaded, 
  currentImageUrl, 
  label = "تصویر" 
}: ImageUploadWithUrlProps) {
  const [uploadedUrl, setUploadedUrl] = useState(currentImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطا",
        description: "فقط فایل‌های تصویری مجاز هستند",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setPreviewUrl(base64Image);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to upload image");
        }

        const { url } = await response.json();

        setUploadedUrl(url);
        setPreviewUrl(url);
        onImageUploaded(url);
        toast({
          title: "موفق",
          description: "تصویر با موفقیت آپلود شد",
        });
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage = error instanceof Error ? error.message : "خطای اپلود عکس";
        toast({
          title: "خطا در آپلود",
          description: errorMessage === "Failed to upload image" ? 
            "لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید" : errorMessage,
          variant: "destructive",
        });
        setPreviewUrl("");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً آدرس تصویر را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    if (!urlInput.startsWith("http")) {
      toast({
        title: "خطا",
        description: "آدرس تصویر باید با http یا https شروع شود",
        variant: "destructive",
      });
      return;
    }

    setUploadedUrl(urlInput);
    setPreviewUrl(urlInput);
    onImageUploaded(urlInput);
    toast({
      title: "موفق",
      description: "آدرس تصویر با موفقیت ثبت شد",
    });
  };

  const handleRemove = () => {
    setUploadedUrl("");
    setPreviewUrl("");
    setUrlInput("");
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-lg border p-2 bg-muted/30">
            <img 
              src={previewUrl} 
              alt="پیش‌نمایش" 
              className="w-full h-48 object-cover rounded"
            />
            {!isUploading && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-4 left-4"
                onClick={handleRemove}
                data-testid="button-remove-image"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">در حال آپلود...</p>
                </div>
              </div>
            )}
          </div>
          {uploadedUrl && (
            <p className="text-xs text-muted-foreground truncate" data-testid="text-image-url">
              ✓ ثبت شد
            </p>
          )}
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" data-testid="tab-upload">
              <Upload className="ml-2 h-4 w-4" />
              آپلود فایل
            </TabsTrigger>
            <TabsTrigger value="url" data-testid="tab-url">
              <Link className="ml-2 h-4 w-4" />
              آدرس (URL)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isUploading}
              data-testid="button-show-uploader"
            >
              <Upload className="ml-2 h-4 w-4" />
              انتخاب تصویر از گالری
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              حداکثر حجم: ۵ مگابایت | فرمت‌های مجاز: JPG, PNG, GIF
            </p>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1"
                dir="ltr"
                data-testid="input-url"
              />
              <Button
                type="button"
                onClick={handleUrlSubmit}
                data-testid="button-submit-url"
              >
                ثبت
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              آدرس تصویر آپلود شده در Cloudinary یا سایر سرویس‌ها
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
