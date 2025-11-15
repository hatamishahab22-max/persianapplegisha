import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Edit2, Check, X, RefreshCw } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface ProductPrice {
  id: string;
  price: string;
  model: {
    name: string;
    nameFa: string;
    category: {
      nameFa: string;
    };
  };
  color: {
    name: string;
    nameFa: string;
  };
  storageOption: {
    name: string;
    nameFa: string;
  };
}

export default function PriceManagerSimple() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: allPrices, isLoading, refetch } = useQuery<ProductPrice[]>({
    queryKey: ['/api/product-prices'],
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: string }) => {
      return apiRequest('PATCH', `/api/admin/product-prices/${id}`, { price });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/product-prices'] });
      toast({
        title: "✅ موفق!",
        description: "قیمت با موفقیت آپدیت شد",
      });
      setEditingId(null);
      setEditValue("");
    },
    onError: (error: any) => {
      toast({
        title: "❌ خطا",
        description: error.message || "خطا در آپدیت قیمت",
        variant: "destructive",
      });
    },
  });

  const handleStartEdit = (price: ProductPrice) => {
    setEditingId(price.id);
    setEditValue(price.price);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue && !isNaN(Number(editValue))) {
      updatePriceMutation.mutate({ id, price: editValue });
    } else {
      toast({
        title: "خطا",
        description: "لطفاً یک عدد معتبر وارد کنید",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const formatPrice = (price: string) => {
    const num = parseInt(price);
    if (isNaN(num) || num === 0) return "قیمت نامشخص";
    return new Intl.NumberFormat('fa-IR').format(num) + " تومان";
  };

  return (
    <div className="space-y-6 p-6" data-testid="page-price-manager" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت قیمت‌ها</h1>
          <p className="text-muted-foreground mt-2">
            {allPrices ? `${allPrices.length} محصول` : 'در حال بارگذاری...'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          data-testid="button-refresh"
        >
          <RefreshCw className="h-4 w-4 ml-2" />
          بروزرسانی
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">در حال بارگذاری محصولات...</div>
        </Card>
      ) : allPrices && allPrices.length > 0 ? (
        <div className="space-y-3">
          {allPrices.map((price) => (
            <Card key={price.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg mb-1">
                      {price.model.nameFa}
                      <span className="text-sm text-muted-foreground mr-2">
                        ({price.model.category.nameFa})
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      رنگ: {price.color.nameFa} • حافظه: {price.storageOption.nameFa}
                    </div>
                  </div>

                  {/* Price & Edit */}
                  <div className="flex items-center gap-3">
                    {editingId === price.id ? (
                      <>
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-[180px]"
                          placeholder="قیمت به تومان"
                          autoFocus
                          data-testid={`input-edit-price-${price.id}`}
                        />
                        <Button
                          size="icon"
                          variant="default"
                          onClick={() => handleSaveEdit(price.id)}
                          disabled={updatePriceMutation.isPending}
                          data-testid={`button-save-${price.id}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleCancelEdit}
                          data-testid={`button-cancel-${price.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="min-w-[180px] text-left">
                          <div className="text-lg font-bold">
                            {formatPrice(price.price)}
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleStartEdit(price)}
                          data-testid={`button-edit-${price.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">هیچ محصولی یافت نشد</h3>
          <p className="text-muted-foreground mb-4">
            ابتدا باید دیتابیس را Seed کنید
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/admin/seed'}>
            رفتن به صفحه Seed
          </Button>
        </Card>
      )}
    </div>
  );
}
