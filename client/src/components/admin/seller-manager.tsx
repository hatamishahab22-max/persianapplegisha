import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Edit, Trash2, User, Phone, Store, 
  Eye, EyeOff, Save, X, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Seller {
  id: string;
  name: string;
  username: string;
  phone: string | null;
  storeName: string | null;
  storeAddress: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function SellerManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
    storeName: "",
    storeAddress: "",
  });

  const { data: sellers = [], isLoading } = useQuery<Seller[]>({
    queryKey: ["/api/admin/sellers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create seller");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers"] });
      toast({ title: "موفق", description: "فروشنده جدید اضافه شد" });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/sellers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update seller");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers"] });
      toast({ title: "موفق", description: "فروشنده ویرایش شد" });
      setEditingSeller(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "خطا", description: "مشکلی پیش آمد", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/sellers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete seller");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers"] });
      toast({ title: "موفق", description: "فروشنده حذف شد" });
    },
    onError: () => {
      toast({ title: "خطا", description: "مشکلی پیش آمد", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/sellers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed to update seller");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      phone: "",
      storeName: "",
      storeAddress: "",
    });
    setShowPassword(false);
  };

  const openEditDialog = (seller: Seller) => {
    setEditingSeller(seller);
    setFormData({
      name: seller.name,
      username: seller.username,
      password: "",
      phone: seller.phone || "",
      storeName: seller.storeName || "",
      storeAddress: seller.storeAddress || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.username) {
      toast({ title: "خطا", description: "نام و نام کاربری الزامی است", variant: "destructive" });
      return;
    }

    if (!editingSeller && !formData.password) {
      toast({ title: "خطا", description: "رمز عبور برای فروشنده جدید الزامی است", variant: "destructive" });
      return;
    }

    const data: any = {
      name: formData.name,
      username: formData.username,
      phone: formData.phone || null,
      storeName: formData.storeName || null,
      storeAddress: formData.storeAddress || null,
    };

    if (formData.password) {
      data.password = formData.password;
    }

    if (editingSeller) {
      updateMutation.mutate({ id: editingSeller.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            مدیریت فروشندگان پیشنهاد رویایی
          </h2>
          <p className="text-muted-foreground mt-1">
            اضافه کردن و مدیریت فروشندگانی که می‌توانند گوشی‌های به قیمت را ثبت کنند
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingSeller(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 ml-2" />
              اضافه کردن فروشنده
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingSeller ? "ویرایش فروشنده" : "اضافه کردن فروشنده جدید"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نام نمایشی *</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="pr-9"
                      placeholder="مثلا: علی"
                      data-testid="input-seller-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>نام کاربری *</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="مثلا: ali123"
                    data-testid="input-seller-username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{editingSeller ? "رمز عبور جدید (اختیاری)" : "رمز عبور *"}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder={editingSeller ? "خالی بگذارید برای عدم تغییر" : "رمز عبور"}
                    data-testid="input-seller-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>شماره تماس</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pr-9"
                    placeholder="09121234567"
                    data-testid="input-seller-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>نام فروشگاه</Label>
                <div className="relative">
                  <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={formData.storeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                    className="pr-9"
                    placeholder="مثلا: موبایل پلاک ۲۶۱"
                    data-testid="input-seller-store"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>آدرس فروشگاه</Label>
                <Input
                  value={formData.storeAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeAddress: e.target.value }))}
                  placeholder="تهران، بازار موبایل..."
                  data-testid="input-seller-address"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  data-testid="button-save-seller"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {editingSeller ? "ذخیره تغییرات" : "اضافه کردن"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingSeller(null);
                    resetForm();
                  }}
                  data-testid="button-cancel-seller"
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
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      ) : sellers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">هنوز فروشنده‌ای اضافه نشده</h3>
            <p className="text-muted-foreground">
              با کلیک روی دکمه بالا، اولین فروشنده را اضافه کنید
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sellers.map((seller) => (
            <Card key={seller.id} className={!seller.isActive ? "opacity-60" : ""} data-testid={`card-seller-${seller.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                      {seller.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{seller.name}</h3>
                        <Badge variant="secondary">@{seller.username}</Badge>
                        {!seller.isActive && (
                          <Badge variant="destructive">غیرفعال</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        {seller.storeName && (
                          <span className="flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            {seller.storeName}
                          </span>
                        )}
                        {seller.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {seller.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${seller.id}`} className="text-sm text-muted-foreground">
                        فعال
                      </Label>
                      <Switch
                        id={`active-${seller.id}`}
                        checked={seller.isActive}
                        onCheckedChange={(checked) => 
                          toggleActiveMutation.mutate({ id: seller.id, isActive: checked })
                        }
                        data-testid={`switch-active-${seller.id}`}
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(seller)}
                      data-testid={`button-edit-${seller.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.")) {
                          deleteMutation.mutate(seller.id);
                        }
                      }}
                      data-testid={`button-delete-${seller.id}`}
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
  );
}
