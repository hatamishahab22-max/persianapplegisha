import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { UsedPhone } from "@shared/schema";
import ImageUploader from "@/components/ImageUploader";

export default function UsedIphonesManager() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPhone, setEditingPhone] = useState<UsedPhone | null>(null);
  const [formData, setFormData] = useState({
    model: "",
    modelFa: "",
    storage: "",
    color: "",
    colorFa: "",
    condition: "excellent",
    conditionFa: "عالی",
    batteryHealth: 100,
    price: "",
    description: "",
    descriptionFa: "",
    images: [] as string[],
    isApproved: true as boolean,
    isSold: false as boolean,
  });

  const { data: phones = [], isLoading } = useQuery<UsedPhone[]>({
    queryKey: ["/api/used-phones"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/used-phones", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/used-phones"] });
      toast({ title: "گوشی با موفقیت اضافه شد" });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      toast({ 
        title: "خطا در افزودن گوشی", 
        description: error?.message || "لطفاً دوباره تلاش کنید",
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PATCH", `/api/used-phones/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/used-phones"] });
      toast({ title: "گوشی با موفقیت ویرایش شد" });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({ 
        title: "خطا در ویرایش گوشی",
        description: error?.message || "لطفاً دوباره تلاش کنید",
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/used-phones/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/used-phones"] });
      toast({ title: "گوشی با موفقیت حذف شد" });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({ 
        title: "خطا در حذف گوشی", 
        description: error?.message || "لطفاً دوباره تلاش کنید",
        variant: "destructive" 
      });
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPhone) {
      updateMutation.mutate({
        id: editingPhone.id,
        data: {
          ...formData,
          price: formData.price,
        }
      });
    } else {
      createMutation.mutate({
        ...formData,
        price: formData.price,
      });
    }
  };

  const handleEdit = (phone: UsedPhone) => {
    setEditingPhone(phone);
    setIsEditing(true);
    setFormData({
      model: phone.model || "",
      modelFa: phone.modelFa || "",
      storage: phone.storage || "",
      color: phone.color || "",
      colorFa: phone.colorFa || "",
      condition: phone.condition || "excellent",
      conditionFa: phone.conditionFa || "عالی",
      batteryHealth: phone.batteryHealth || 100,
      price: phone.price.toString(),
      description: phone.description || "",
      descriptionFa: phone.descriptionFa || "",
      images: phone.images || [],
      isApproved: phone.isApproved ?? true,
      isSold: phone.isSold ?? false,
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingPhone(null);
    setFormData({
      model: "",
      modelFa: "",
      storage: "",
      color: "",
      colorFa: "",
      condition: "excellent",
      conditionFa: "عالی",
      batteryHealth: 100,
      price: "",
      description: "",
      descriptionFa: "",
      images: [],
      isApproved: true,
      isSold: false,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت گوشی‌های کارکرده</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} data-testid="button-add-phone">
            <Plus className="w-4 h-4 ml-2" />
            افزودن گوشی جدید
          </Button>
        )}
      </div>

      {isEditing && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingPhone ? "ویرایش گوشی" : "افزودن گوشی جدید"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>مدل</Label>
                <Input
                  value={formData.modelFa || formData.model}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    model: e.target.value,
                    modelFa: e.target.value 
                  })}
                  placeholder="هر زبانی - مثلاً: آیفون ۱۵ پرو مکس یا iPhone 15 Pro Max"
                  data-testid="input-model"
                />
              </div>

              <div>
                <Label>حجم</Label>
                <Input
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  placeholder="مثلاً: 256GB یا ۲۵۶ گیگ"
                  data-testid="input-storage"
                />
              </div>

              <div className="col-span-2">
                <Label>رنگ</Label>
                <Input
                  value={formData.colorFa || formData.color}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    color: e.target.value,
                    colorFa: e.target.value 
                  })}
                  placeholder="هر رنگی - فارسی یا انگلیسی"
                  data-testid="input-color"
                />
              </div>

              <div>
                <Label>وضعیت</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => {
                    const conditionMap: Record<string, string> = {
                      excellent: "عالی",
                      good: "خوب",
                      fair: "متوسط"
                    };
                    setFormData({ 
                      ...formData, 
                      condition: value,
                      conditionFa: conditionMap[value]
                    });
                  }}
                >
                  <SelectTrigger data-testid="select-condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">عالی</SelectItem>
                    <SelectItem value="good">خوب</SelectItem>
                    <SelectItem value="fair">متوسط</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>سلامت باتری (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.batteryHealth}
                  onChange={(e) => setFormData({ ...formData, batteryHealth: parseInt(e.target.value) })}
                  data-testid="input-battery"
                />
              </div>

              <div>
                <Label>قیمت (تومان)</Label>
                <Input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="50000000"
                  data-testid="input-price"
                />
              </div>
            </div>

            <div>
              <Label>توضیحات (فارسی)</Label>
              <Textarea
                value={formData.descriptionFa}
                onChange={(e) => setFormData({ ...formData, descriptionFa: e.target.value })}
                placeholder="توضیحات تکمیلی..."
                data-testid="textarea-description-fa"
              />
            </div>

            <div>
              <Label>عکس‌ها</Label>
              <ImageUploader
                images={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
                maxImages={10}
                disabled={createMutation.isPending || updateMutation.isPending}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-submit-phone"
              >
                {editingPhone ? "ذخیره تغییرات" : "افزودن گوشی"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                data-testid="button-cancel"
              >
                لغو
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {phones.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            هیچ گوشی کارکرده‌ای ثبت نشده است
          </Card>
        ) : (
          phones.map((phone) => (
            <Card key={phone.id} className="p-4">
              <div className="flex gap-4">
                {phone.images && phone.images.length > 0 && (
                  <img
                    src={phone.images[0]}
                    alt={phone.modelFa || phone.model || "Used Phone"}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg" data-testid={`text-phone-name-${phone.id}`}>
                    {phone.modelFa || phone.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {phone.storage} - {phone.colorFa || phone.color} - {phone.conditionFa || phone.condition}
                  </p>
                  {phone.batteryHealth && (
                    <p className="text-sm">
                      سلامت باتری: {phone.batteryHealth}%
                    </p>
                  )}
                  <p className="font-bold mt-2" data-testid={`text-phone-price-${phone.id}`}>
                    {Number(phone.price).toLocaleString('fa-IR')} تومان
                  </p>
                  {phone.isSold && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2">
                      فروخته شده
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(phone)}
                    data-testid={`button-edit-phone-${phone.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (confirm("آیا از حذف این گوشی مطمئن هستید؟")) {
                        deleteMutation.mutate(phone.id);
                      }
                    }}
                    data-testid={`button-delete-phone-${phone.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
