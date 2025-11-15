import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Search, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

type ProductPrice = any; // Will be properly typed when backend is ready

export default function PriceManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<ProductPrice[]>({
    queryKey: ["/api/product-prices"],
  });

  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (products.length > 0) {
      setPrices(Object.fromEntries(products.map((p) => [p.id, p.price])));
    }
  }, [products]);

  const handlePriceChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setPrices({ ...prices, [id]: numValue });
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      console.log("Updating price for product:", id, "with price:", price);
      try {
        const result = await apiRequest(`/api/product-prices/${id}`, "PATCH", { price });
        console.log("Update successful:", result);
        return result;
      } catch (error) {
        console.error("Update failed:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-prices"] });
      toast({
        title: "ذخیره شد",
        description: "قیمت با موفقیت بروزرسانی شد",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "خطا",
        description: "مشکلی در بروزرسانی قیمت پیش آمد",
        variant: "destructive",
      });
    },
  });

  const handleSave = async (id: string) => {
    updateMutation.mutate({ id, price: prices[id] || 0 });
  };

  const handleSaveAll = async () => {
    for (const id of Object.keys(prices)) {
      await updateMutation.mutateAsync({ id, price: prices[id] || 0 });
    }
  };

  const filteredProducts = products.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.model.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower) ||
      (p.variant && p.variant.toLowerCase().includes(searchLower)) ||
      (p.storage && p.storage.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">مدیریت قیمت‌ها</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجوی محصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              data-testid="input-search-products"
            />
          </div>
          <Button onClick={handleSaveAll} data-testid="button-save-all-prices">
            <Save className="ml-2 h-4 w-4" />
            ذخیره همه
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>در حال بارگذاری...</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-right text-sm font-medium">دسته</th>
                  <th className="p-4 text-right text-sm font-medium">مدل</th>
                  <th className="p-4 text-right text-sm font-medium">رنگ/نوع</th>
                  <th className="p-4 text-right text-sm font-medium">حافظه</th>
                  <th className="p-4 text-right text-sm font-medium">قیمت (تومان)</th>
                  <th className="p-4 text-right text-sm font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    محصولی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm">{product.category}</td>
                    <td className="p-4 text-sm font-medium">{product.model}</td>
                    <td className="p-4 text-sm">{product.variant || "-"}</td>
                    <td className="p-4 text-sm">{product.storage || "-"}</td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={prices[product.id] || ""}
                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                        placeholder="قیمت"
                        className="max-w-[180px] font-mono"
                        data-testid={`input-price-${product.id}`}
                      />
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSave(product.id)}
                        data-testid={`button-save-${product.id}`}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 نکته: قیمت‌ها به صورت خودکار در سایت نمایش داده می‌شوند. به یاد داشته باشید که به مشتریان اطلاع دهید قیمت‌ها تقریبی هستند.
        </p>
      </div>
    </div>
  );
}
