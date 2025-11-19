import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Search, RefreshCw, Check, X } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface ProductPrice {
  id: string;
  modelId: string;
  colorId: string;
  storageOptionId: string;
  price: string;
  model: {
    id: string;
    name: string;
    nameFa: string;
    category: {
      id: string;
      name: string;
      nameFa: string;
    };
  };
  color: {
    id: string;
    name: string;
    nameFa: string;
  };
  storageOption: {
    id: string;
    name: string;
    nameFa: string;
  };
}

export default function PriceManagerNew() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: categories } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

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

  const filteredPrices = allPrices?.filter(price => {
    const matchesSearch = 
      price.model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.model.nameFa.includes(searchTerm) ||
      price.color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.color.nameFa.includes(searchTerm) ||
      price.storageOption.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      price.model.category.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleStartEdit = (price: ProductPrice) => {
    setEditingId(price.id);
    setEditValue(price.price);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue && !isNaN(Number(editValue))) {
      updatePriceMutation.mutate({ id, price: editValue });
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
      <div>
        <h1 className="text-3xl font-bold">مدیریت قیمت‌های محصولات</h1>
        <p className="text-muted-foreground mt-2">
          لیست کامل محصولات با امکان ویرایش سریع قیمت‌ها
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              فیلتر و جستجو
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              بروزرسانی
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در مدل، رنگ، حافظه..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]" data-testid="select-category">
                <SelectValue placeholder="همه دسته‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌ها</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameFa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              در حال بارگذاری...
            </div>
          ) : filteredPrices && filteredPrices.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full" dir="rtl">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right p-3 font-semibold">دسته‌بندی</th>
                    <th className="text-right p-3 font-semibold">مدل</th>
                    <th className="text-right p-3 font-semibold">رنگ</th>
                    <th className="text-right p-3 font-semibold">حافظه</th>
                    <th className="text-right p-3 font-semibold">قیمت (تومان)</th>
                    <th className="text-center p-3 font-semibold">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrices.map((price, index) => (
                    <tr 
                      key={price.id} 
                      className={`border-t hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
                      data-testid={`row-price-${price.id}`}
                    >
                      <td className="p-3 text-sm">{price.model.category.nameFa}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{price.model.nameFa}</div>
                          <div className="text-xs text-muted-foreground">{price.model.name}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="text-sm">{price.color.nameFa}</div>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{price.storageOption.nameFa}</td>
                      <td className="p-3">
                        {editingId === price.id ? (
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full max-w-[200px]"
                            placeholder="قیمت (تومان)"
                            autoFocus
                            data-testid={`input-edit-price-${price.id}`}
                          />
                        ) : (
                          <div className="font-medium">
                            {formatPrice(price.price)}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === price.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleSaveEdit(price.id)}
                                disabled={updatePriceMutation.isPending}
                                data-testid={`button-save-${price.id}`}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                                data-testid={`button-cancel-${price.id}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartEdit(price)}
                              data-testid={`button-edit-${price.id}`}
                            >
                              ویرایش
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              هیچ محصولی یافت نشد
            </div>
          )}

          {filteredPrices && filteredPrices.length > 0 && (
            <div className="text-sm text-muted-foreground">
              تعداد کل: {filteredPrices.length} محصول
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
