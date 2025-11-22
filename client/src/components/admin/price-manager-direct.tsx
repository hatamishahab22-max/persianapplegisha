import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit2 } from "lucide-react";

interface ProductModel {
  id: string;
  name: string;
  nameFa: string;
}

interface ProductColor {
  id: string;
  name: string;
  nameFa: string;
}

interface ProductStorageOption {
  id: string;
  name: string;
  nameFa: string;
}

interface ProductPrice {
  id: string;
  modelId: string;
  storageId: string;
  colorId: string;
  price: string;
}

interface PriceRow extends ProductPrice {
  modelName?: string;
  colorName?: string;
  storageName?: string;
}

export default function PriceManagerDirect() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");

  // Fetch data
  const { data: prices = [] } = useQuery<ProductPrice[]>({
    queryKey: ["admin-prices"],
    queryFn: async () => {
      const res = await fetch("/api/product-prices");
      if (!res.ok) throw new Error("Failed to fetch prices");
      return res.json();
    },
  });

  const { data: models = [] } = useQuery<ProductModel[]>({
    queryKey: ["admin-models"],
    queryFn: async () => {
      const res = await fetch("/api/models");
      if (!res.ok) throw new Error("Failed to fetch models");
      return res.json();
    },
  });

  const { data: colors = [] } = useQuery<ProductColor[]>({
    queryKey: ["admin-colors"],
    queryFn: async () => {
      const res = await fetch("/api/colors");
      if (!res.ok) throw new Error("Failed to fetch colors");
      return res.json();
    },
  });

  const { data: storageOptions = [] } = useQuery<ProductStorageOption[]>({
    queryKey: ["admin-storage"],
    queryFn: async () => {
      const res = await fetch("/api/storage-options");
      if (!res.ok) throw new Error("Failed to fetch storage");
      return res.json();
    },
  });

  // Mutations
  const updatePriceMutation = useMutation({
    mutationFn: async (data: { id: string; price: string }) => {
      const res = await fetch(`/api/product-prices/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: data.price }),
      });
      if (!res.ok) throw new Error("Failed to update price");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prices"] });
      setEditingId(null);
    },
  });

  const deletePriceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/product-prices/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete price");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prices"] });
    },
  });

  // Enrich prices with names
  const enrichedPrices: PriceRow[] = prices.map((price) => ({
    ...price,
    modelName: models.find((m) => m.id === price.modelId)?.nameFa || price.modelId,
    colorName: colors.find((c) => c.id === price.colorId)?.nameFa || price.colorId,
    storageName: storageOptions.find((s) => s.id === price.storageId)?.name || price.storageId,
  }));

  const handleSavePrice = (id: string) => {
    if (!editPrice.trim()) return;
    updatePriceMutation.mutate({ id, price: editPrice });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>مدیریت قیمت‌ها</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            کل قیمت‌ها: {enrichedPrices.length}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-2 px-2">مدل</th>
                  <th className="text-right py-2 px-2">رنگ</th>
                  <th className="text-right py-2 px-2">حجم</th>
                  <th className="text-right py-2 px-2">قیمت (تومان)</th>
                  <th className="text-right py-2 px-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {enrichedPrices.map((price) => (
                  <tr key={price.id} className="border-b hover:bg-accent/50">
                    <td className="py-2 px-2">{price.modelName}</td>
                    <td className="py-2 px-2">{price.colorName}</td>
                    <td className="py-2 px-2">{price.storageName}</td>
                    <td className="py-2 px-2">
                      {editingId === price.id ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-32 h-8"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSavePrice(price.id)}
                            disabled={updatePriceMutation.isPending}
                          >
                            ذخیره
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            لغو
                          </Button>
                        </div>
                      ) : (
                        <span>{parseInt(price.price).toLocaleString("fa-IR")}</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex gap-2">
                        {editingId !== price.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(price.id);
                              setEditPrice(price.price);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("آیا مطمئن هستید؟")) {
                              deletePriceMutation.mutate(price.id);
                            }
                          }}
                          disabled={deletePriceMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
