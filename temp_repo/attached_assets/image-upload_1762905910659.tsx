import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export default function ImageUpload({ onImageUploaded, currentImageUrl, label = "تصویر" }: ImageUploadProps) {
  const [uploadedUrl, setUploadedUrl] = useState(currentImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطا",
        description: "فقط فایل‌های تصویری مجاز هستند",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64 and show preview
    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setPreviewUrl(base64Image);

      try {
        // Upload to Cloudinary
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

        // Success
        setUploadedUrl(url);
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

  const handleRemove = () => {
    setUploadedUrl("");
    setPreviewUrl("");
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
              ✓ آپلود شد
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
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
        </div>
      )}
    </div>
  );
}
