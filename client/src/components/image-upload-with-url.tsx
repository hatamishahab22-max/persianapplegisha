import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Link, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadWithUrlProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  label?: string;
}

export default function ImageUploadWithUrl({
  value = [],
  onChange,
  maxImages = 5,
  label = "تصاویر"
}: ImageUploadWithUrlProps) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطا",
        description: "لطفاً فقط فایل تصویری انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const newImages = [...value, base64];
        onChange(newImages.slice(0, maxImages));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "خطا در آپلود",
        description: "آپلود تصویر با مشکل مواجه شد",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlAdd = () => {
    if (!imageUrl) {
      toast({
        title: "خطا",
        description: "لطفاً آدرس تصویر را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)/i)) {
      toast({
        title: "خطا",
        description: "آدرس تصویر معتبر نیست",
        variant: "destructive",
      });
      return;
    }

    const newImages = [...value, imageUrl];
    onChange(newImages.slice(0, maxImages));
    setImageUrl("");
    toast({
      title: "موفق",
      description: "تصویر اضافه شد",
    });
  };

  const handleRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload from file */}
        <div>
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center justify-center w-full h-32 px-4 transition bg-muted border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary focus:outline-none">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  کلیک کنید یا فایل را اینجا بکشید
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading || value.length >= maxImages}
                data-testid="input-file-upload"
              />
            </div>
          </Label>
        </div>

        {/* Add from URL */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="image-url">یا آدرس اینترنتی تصویر را وارد کنید</Label>
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={value.length >= maxImages}
              data-testid="input-image-url"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleUrlAdd}
            disabled={!imageUrl || value.length >= maxImages}
            className="self-end"
            data-testid="button-add-url"
          >
            <Link className="h-4 w-4 ml-2" />
            افزودن
          </Button>
        </div>

        {/* Preview images */}
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {value.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`تصویر ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                  data-testid={`button-remove-image-${index}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {value.length >= maxImages && (
          <p className="text-sm text-muted-foreground text-center">
            حداکثر {maxImages} تصویر می‌توانید آپلود کنید
          </p>
        )}
      </CardContent>
    </Card>
  );
}