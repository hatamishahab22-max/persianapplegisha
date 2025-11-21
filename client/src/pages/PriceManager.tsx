import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceItem {
  id: string;
  modelName: string;
  colorFa: string;
  storage: string;
  price: number;
  colorHex?: string;
}

export default function PriceManager() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/iphone-prices");
      if (!res.ok) throw new Error("Failed to load prices");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error loading prices:", error);
      toast({
        title: "خطا در بارگذاری",
        description: "قیمت‌ها بارگذاری نشدند",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = (id: string, newPrice: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, price: parseInt(newPrice) || 0 } : item
    ));
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/iphone-prices/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });

      if (!res.ok) throw new Error("Failed to save prices");

      toast({
        title: "موفق!",
        description: "قیمت‌ها با موفقیت بروز شدند",
        className: "bg-green-500 text-white border-none"
      });
    } catch (error) {
      console.error("Error saving prices:", error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره قیمت‌ها",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-['Vazirmatn']">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Vazirmatn'] p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">مدیریت قیمت آیفون</h1>
        <button
          onClick={() => setLocation("/admin")}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Price Table */}
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/10">
              <th className="px-6 py-4 text-right">مدل</th>
              <th className="px-6 py-4 text-right">رنگ</th>
              <th className="px-6 py-4 text-right">ظرفیت</th>
              <th className="px-6 py-4 text-right">قیمت (تومان)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">{item.modelName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.colorHex && (
                      <div
                        className="w-6 h-6 rounded-full border border-white/20"
                        style={{ backgroundColor: item.colorHex }}
                      />
                    )}
                    <span>{item.colorFa}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{item.storage}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updatePrice(item.id, e.target.value)}
                    className="w-full max-w-48 bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                    data-testid={`price-input-${item.id}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-save-prices"
        >
          <Save className="w-5 h-5" />
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </div>
  );
}
