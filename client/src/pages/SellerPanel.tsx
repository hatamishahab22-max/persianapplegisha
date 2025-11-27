import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowRight, Plus, Trash2, Edit, Phone, Package, 
  LogOut, Save, X, Image, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Seller {
  id: string;
  name: string;
  username: string;
  phone: string | null;
  storeName: string | null;
}

interface DreamPhone {
  id: string;
  model: string;
  storage: string | null;
  color: string | null;
  colorFa: string | null;
  condition: string | null;
  conditionFa: string | null;
  price: string;
  originalPrice: string | null;
  description: string | null;
  images: string[] | null;
  isAvailable: boolean;
  isSold: boolean;
}

const IPHONE_MODELS = [
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14 Plus",
  "iPhone 14",
  "iPhone 13 Pro Max",
  "iPhone 13 Pro",
  "iPhone 13",
  "iPhone 12 Pro Max",
  "iPhone 12 Pro",
  "iPhone 12",
  "iPhone 11 Pro Max",
  "iPhone 11 Pro",
  "iPhone 11",
];

const STORAGE_OPTIONS = ["128GB", "256GB", "512GB", "1TB"];

const COLOR_OPTIONS = [
  { name: "Black", nameFa: "مشکی" },
  { name: "White", nameFa: "سفید" },
  { name: "Natural Titanium", nameFa: "تیتانیوم طبیعی" },
  { name: "Blue Titanium", nameFa: "تیتانیوم آبی" },
  { name: "White Titanium", nameFa: "تیتانیوم سفید" },
  { name: "Black Titanium", nameFa: "تیتانیوم مشکی" },
  { name: "Desert Titanium", nameFa: "تیتانیوم صحرایی" },
  { name: "Pink", nameFa: "صورتی" },
  { name: "Blue", nameFa: "آبی" },
  { name: "Green", nameFa: "سبز" },
  { name: "Yellow", nameFa: "زرد" },
  { name: "Purple", nameFa: "بنفش" },
  { name: "Red", nameFa: "قرمز" },
];

const CONDITION_OPTIONS = [
  { value: "new", label: "آکبند" },
  { value: "like_new", label: "در حد نو" },
  { value: "used", label: "کارکرده" },
];

export default function SellerPanel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<DreamPhone | null>(null);

  const [formData, setFormData] = useState({
    model: "",
    storage: "",
    color: "",
    colorFa: "",
    condition: "new",
    conditionFa: "آکبند",
    price: "",
    originalPrice: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetch("/api/seller/check")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.seller) {
          setSeller(data.seller);
        } else {
          setLocation("/seller/login");
        }
      })
      .catch(() => setLocation("/seller/login"));
  }, [setLocation]);

  const { data: phones = [], isLoading } = useQuery<DreamPhone[]>({
    queryKey: ["/api/seller/phones"],
    enabled: !!seller,
  });

  const addPhoneMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/seller/phones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add phone");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/phones"] });
      toast({ title: "موفق", description: "گوشی با موفقیت اضافه شد" });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "خطا", description: "مشکلی پیش آمد", variant: "destructive" });
    },
  });

  const updatePhoneMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/seller/phones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update phone");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/phones"] });
      toast({ title: "موفق", description: "گوشی با موفقیت ویرایش شد" });
      setEditingPhone(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "خطا", description: "مشکلی پیش آمد", variant: "destructive" });
    },
  });

  const deletePhoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/seller/phones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete phone");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/phones"] });
      toast({ title: "موفق", description: "گوشی حذف شد" });
    },
    onError: () => {
      toast({ title: "خطا", description: "مشکلی پیش آمد", variant: "destructive" });
    },
  });

  const markSoldMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/seller/phones/${id}/sold`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to mark as sold");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/phones"] });
      toast({ title: "موفق", description: "گوشی به عنوان فروخته شده علامت گذاری شد" });
    },
  });

  const handleLogout = async () => {
    await fetch("/api/seller/logout", { method: "POST" });
    setLocation("/dream-deals");
  };

  const resetForm = () => {
    setFormData({
      model: "",
      storage: "",
      color: "",
      colorFa: "",
      condition: "new",
      conditionFa: "آکبند",
      price: "",
      originalPrice: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleColorChange = (colorName: string) => {
    const color = COLOR_OPTIONS.find(c => c.name === colorName);
    if (color) {
      setFormData(prev => ({ ...prev, color: color.name, colorFa: color.nameFa }));
    }
  };

  const handleConditionChange = (value: string) => {
    const condition = CONDITION_OPTIONS.find(c => c.value === value);
    if (condition) {
      setFormData(prev => ({ ...prev, condition: value, conditionFa: condition.label }));
    }
  };

  const handleSubmit = () => {
    if (!formData.model || !formData.price) {
      toast({ title: "خطا", description: "مدل و قیمت الزامی است", variant: "destructive" });
      return;
    }

    const phoneData = {
      ...formData,
      images: formData.imageUrl ? [formData.imageUrl] : [],
    };

    if (editingPhone) {
      updatePhoneMutation.mutate({ id: editingPhone.id, data: phoneData });
    } else {
      addPhoneMutation.mutate(phoneData);
    }
  };

  const openEditDialog = (phone: DreamPhone) => {
    setEditingPhone(phone);
    setFormData({
      model: phone.model,
      storage: phone.storage || "",
      color: phone.color || "",
      colorFa: phone.colorFa || "",
      condition: phone.condition || "new",
      conditionFa: phone.conditionFa || "آکبند",
      price: phone.price,
      originalPrice: phone.originalPrice || "",
      description: phone.description || "",
      imageUrl: phone.images?.[0] || "",
    });
    setIsAddDialogOpen(true);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("fa-IR").format(parseInt(price));
  };

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-500/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{seller.name}</h1>
              <p className="text-sm text-gray-400">{seller.storeName || "پنل فروشنده"}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 ml-2" />
            خروج
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            گوشی‌های من ({phones.length})
          </h2>

          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingPhone(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" data-testid="button-add-phone">
                <Plus className="w-4 h-4 ml-2" />
                اضافه کردن گوشی
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingPhone ? "ویرایش گوشی" : "اضافه کردن گوشی جدید"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">مدل گوشی *</Label>
                  <Select value={formData.model} onValueChange={(v) => setFormData(prev => ({ ...prev, model: v }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-model">
                      <SelectValue placeholder="انتخاب مدل" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {IPHONE_MODELS.map(model => (
                        <SelectItem key={model} value={model} className="text-white hover:bg-gray-700">
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">حافظه</Label>
                    <Select value={formData.storage} onValueChange={(v) => setFormData(prev => ({ ...prev, storage: v }))}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-storage">
                        <SelectValue placeholder="انتخاب" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {STORAGE_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt} className="text-white hover:bg-gray-700">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">رنگ</Label>
                    <Select value={formData.color} onValueChange={handleColorChange}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-color">
                        <SelectValue placeholder="انتخاب" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {COLOR_OPTIONS.map(color => (
                          <SelectItem key={color.name} value={color.name} className="text-white hover:bg-gray-700">
                            {color.nameFa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">وضعیت</Label>
                  <Select value={formData.condition} onValueChange={handleConditionChange}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-condition">
                      <SelectValue placeholder="انتخاب" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {CONDITION_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-gray-700">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">قیمت (تومان) *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="مثلا 55000000"
                      data-testid="input-price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">قیمت اصلی (اختیاری)</Label>
                    <Input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="برای نمایش تخفیف"
                      data-testid="input-original-price"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">لینک عکس</Label>
                  <Input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="https://..."
                    data-testid="input-image"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">توضیحات</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="توضیحات اضافی..."
                    rows={3}
                    data-testid="input-description"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={addPhoneMutation.isPending || updatePhoneMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    data-testid="button-save-phone"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    {editingPhone ? "ذخیره تغییرات" : "اضافه کردن"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingPhone(null);
                      resetForm();
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    data-testid="button-cancel"
                  >
                    <X className="w-4 h-4 ml-2" />
                    انصراف
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          </div>
        ) : phones.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                هنوز گوشی‌ای اضافه نکردید
              </h3>
              <p className="text-gray-400 mb-4">
                اولین گوشی خود را اضافه کنید
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {phones.map((phone) => (
              <Card 
                key={phone.id} 
                className={`bg-gray-800/50 border-gray-700 ${phone.isSold ? 'opacity-60' : ''}`}
                data-testid={`card-my-phone-${phone.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {phone.images && phone.images.length > 0 ? (
                        <img
                          src={phone.images[0]}
                          alt={phone.model}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-700 flex items-center justify-center">
                          <Phone className="w-8 h-8 text-gray-500" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">{phone.model}</h3>
                          {phone.isSold && (
                            <Badge className="bg-red-500">فروخته شده</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {phone.storage && (
                            <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                              {phone.storage}
                            </Badge>
                          )}
                          {phone.colorFa && (
                            <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                              {phone.colorFa}
                            </Badge>
                          )}
                          {phone.conditionFa && (
                            <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                              {phone.conditionFa}
                            </Badge>
                          )}
                        </div>

                        <p className="text-lg font-bold text-green-400">
                          {formatPrice(phone.price)} تومان
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!phone.isSold && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(phone)}
                            className="text-gray-400 hover:text-white hover:bg-gray-700"
                            data-testid={`button-edit-${phone.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markSoldMutation.mutate(phone.id)}
                            className="text-green-400 hover:text-green-300 hover:bg-gray-700"
                            data-testid={`button-sold-${phone.id}`}
                          >
                            فروخته شد
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("آیا مطمئن هستید؟")) {
                            deletePhoneMutation.mutate(phone.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                        data-testid={`button-delete-${phone.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
