import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Battery, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { UsedIphone } from "@shared/schema";
import ImageUploadWithUrl from "@/components/image-upload-with-url";

export default function UsedIphonesManager() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    color: "",
    storage: "",
    batteryHealth: "",
    condition: "",
    description: "",
    price: "",
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
  });

  const { toast } = useToast();

  const { data: usedIphones = [], isLoading } = useQuery<UsedIphone[]>({
    queryKey: ["/api/used-iphones"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/used-iphones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          batteryHealth: parseInt(data.batteryHealth),
          price: parseInt(data.price),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/used-iphones"] });
      toast({
        title: "موفق",
        description: "گوشی کارکرده با موفقیت اضافه شد",
      });
      setFormData({
        model: "",
        color: "",
        storage: "",
        batteryHealth: "",
        condition: "",
        description: "",
        price: "",
        imageUrl1: "",
        imageUrl2: "",
        imageUrl3: "",
      });
      setShowAddForm(false);
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "مشکلی در افزودن گوشی پیش آمد",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/used-iphones/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/used-iphones"] });
      toast({
        title: "حذف شد",
        description: "گوشی با موفقیت حذف شد",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "مشکلی در حذف گوشی پیش آمد",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = async (id: string) => {
    if (confirm("آیا مطمئن هستید که می‌خواهید این گوشی را حذف کنید؟")) {
      deleteMutation.mutate(id);
    }
  };

  const getBatteryColor = (health: number) => {
    if (health >= 90) return "text-green-500";
    if (health >= 80) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">مدیریت گوشی‌های کارکرده</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          data-testid="button-add-used-iphone"
        >
          <Plus className="ml-2 h-4 w-4" />
          افزودن گوشی جدید
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">افزودن گوشی کارکرده</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">مدل</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="مثال: iPhone 14 Pro Max"
                  data-testid="input-model"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">رنگ</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="مثال: مشکی"
                  data-testid="input-color"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage">حافظه</Label>
                <Input
                  id="storage"
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  placeholder="مثال: 256GB"
                  data-testid="input-storage"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batteryHealth">سلامت باتری (%)</Label>
                <Input
                  id="batteryHealth"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.batteryHealth}
                  onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                  placeholder="مثال: 95"
                  data-testid="input-battery-health"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">وضعیت</Label>
                <Input
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="مثال: عالی"
                  data-testid="input-condition"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">قیمت (تومان)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="مثال: 42000000"
                  data-testid="input-price"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات کامل</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="توضیحات دقیق درباره گوشی..."
                rows={4}
                data-testid="input-description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageUploadWithUrl
                label="تصویر اول (ضروری)"
                currentImageUrl={formData.imageUrl1}
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl1: url })}
              />
              <ImageUploadWithUrl
                label="تصویر دوم (اختیاری)"
                currentImageUrl={formData.imageUrl2}
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl2: url })}
              />
              <ImageUploadWithUrl
                label="تصویر سوم (اختیاری)"
                currentImageUrl={formData.imageUrl3}
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl3: url })}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-used-iphone">
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال افزودن...
                  </>
                ) : (
                  "افزودن گوشی"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                data-testid="button-cancel"
              >
                انصراف
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>در حال بارگذاری...</p>
          </div>
        </Card>
      ) : usedIphones.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">هیچ گوشی کارکرده‌ای ثبت نشده است</p>
            <p className="text-sm">برای افزودن گوشی جدید روی دکمه بالا کلیک کنید</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usedIphones.map((phone: any) => (
            <Card key={phone.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{phone.model}</h3>
                    <p className="text-sm text-muted-foreground">
                      {phone.color} - {phone.storage}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 ${getBatteryColor(phone.batteryHealth)}`}>
                    <Battery className="h-4 w-4" />
                    <span className="text-sm font-medium">{phone.batteryHealth}%</span>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">وضعیت:</span>
                    <span className="font-medium">{phone.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">قیمت:</span>
                    <span className="font-medium font-mono">
                      {phone.price.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {phone.description}
                </p>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(phone.id)}
                  data-testid={`button-delete-${phone.id}`}
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
