import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function ImageUploader({ 
  images, 
  onChange, 
  maxImages = 10,
  disabled = false 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "خطا",
        description: `حداکثر ${maxImages} عکس مجاز است`,
        variant: "destructive",
      });
      return;
    }

    // Check file sizes (max 10MB per file)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: "خطا",
        description: `حجم عکس‌ها نباید بیشتر از ۱۰ مگابایت باشد`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert files to base64
      const base64Images = await Promise.all(
        files.map(file => convertToBase64(file))
      );

      console.log(`Uploading ${files.length} images to Cloudinary...`);

      // Upload to server
      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ images: base64Images }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        let errorMessage = `آپلود ناموفق (کد ${response.status})`;
        
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch {
          // Ignore JSON parse error
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const uploadedUrls = data.images.map((img: any) => img.url);

      onChange([...images, ...uploadedUrls]);

      toast({
        title: "موفق",
        description: `${files.length} عکس با موفقیت آپلود شد`,
      });
      
      console.log(`Successfully uploaded ${uploadedUrls.length} images`);
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast({
        title: "خطا در آپلود",
        description: error.message || "مشکلی در آپلود عکس‌ها پیش آمد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading || images.length >= maxImages}
          data-testid="input-file-upload"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading || images.length >= maxImages}
          className="w-full"
          data-testid="button-upload-images"
        >
          {isUploading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال آپلود...
            </>
          ) : (
            <>
              <Upload className="ml-2 h-4 w-4" />
              آپلود تصاویر ({images.length}/{maxImages})
            </>
          )}
        </Button>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border group"
              data-testid={`uploaded-image-${index}`}
            >
              <img
                src={image}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled || isUploading}
                className="absolute top-2 left-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-remove-${index}`}
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image Number Badge */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !isUploading && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            هنوز تصویری آپلود نشده است
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            حداکثر {maxImages} تصویر
          </p>
        </div>
      )}
    </div>
  );
}
