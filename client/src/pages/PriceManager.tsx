import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Save, Loader } from "lucide-react";
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
  const [initializing, setInitializing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/product-prices");
      if (!res.ok) throw new Error("Failed to load prices");
      const data = await res.json();
      
      data.sort((a: PriceItem, b: PriceItem) => {
        if (a.modelName !== b.modelName) {
          return a.modelName.localeCompare(b.modelName, 'fa');
        }
        if (a.storage !== b.storage) {
          return a.storage.localeCompare(b.storage, 'fa');
        }
        return a.colorFa.localeCompare(b.colorFa, 'fa');
      });
      
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

  const initializeProducts = async () => {
    try {
      setInitializing(true);
      const res = await fetch("/api/admin/init-iphone-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error("Failed to initialize products");

      const data = await res.json();
      
      toast({
        title: "موفق!",
        description: `${data.stats.prices} محصول با موفقیت ایجاد شد`,
        className: "bg-green-500 text-white border-none"
      });

      await loadPrices();
    } catch (error) {
      console.error("Error initializing products:", error);
      toast({
        title: "خطا",
        description: "خطا در ایجاد محصولات",
        variant: "destructive"
      });
    } finally {
      setInitializing(false);
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
      const res = await fetch("/api/product-prices/bulk-update", {
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-['Vazirmatn'] p-4 md:p-6" dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">مدیریت قیمت محصولات</h1>
          <button
            onClick={() => setLocation("/admin")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 border border-yellow-500 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">هیچ محصولی ثبت نشده</h2>
            <p className="text-white/70 mb-6">برای شروع باید ابتدا محصولات اولیه ایجاد شوند</p>
            <div className="text-sm text-white/60 mb-4 space-y-1">
              <p>• iPhone: 4 مدل × 8 رنگ × 4 حجم = 128 محصول</p>
              <p>• iPad: 2 مدل × 8 رنگ × 4 حجم = 64 محصول</p>
              <p>• AirPods: 1 مدل × 3 رنگ = 3 محصول</p>
              <p className="font-bold text-green-400 mt-2">جمع کل: 195 محصول</p>
            </div>
            <button
              onClick={initializeProducts}
              disabled={initializing}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
            >
              {initializing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  در حال ایجاد محصولات...
                </>
              ) : (
                <>
                  ایجاد تمام محصولات
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Vazirmatn'] p-4 md:p-6" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">مدیریت قیمت محصولات</h1>
        <button
          onClick={() => setLocation("/admin")}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/10 overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="border-b border-white/10 bg-white/10">
              <th className="px-3 md:px-6 py-3 md:py-4 text-right">مدل</th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-right">رنگ</th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-right">ظرفیت</th>
              <th className="px-3 md:px-6 py-3 md:py-4 text-right">قیمت (تومان)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-3 md:px-6 py-3 md:py-4 font-medium">{item.modelName}</td>
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    {item.colorHex && (
                      <div
                        className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/20 flex-shrink-0"
                        style={{ backgroundColor: item.colorHex }}
                        title={item.colorFa}
                      />
                    )}
                    <span className="truncate">{item.colorFa}</span>
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4">{item.storage}</td>
                <td className="px-3 md:px-6 py-3 md:py-4">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updatePrice(item.id, e.target.value)}
                    className="w-full max-w-40 md:max-w-48 bg-white/10 border border-white/20 rounded px-2 md:px-3 py-2 text-white focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-between items-center gap-4">
        <div className="text-white/70 text-sm md:text-base">
          تعداد محصولات: <span className="font-bold text-white">{items.length}</span>
        </div>
        <button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          <Save className="w-4 h-4 md:w-5 md:h-5" />
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </div>
  );
}
