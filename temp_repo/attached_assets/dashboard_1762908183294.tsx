import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Package, Smartphone, DollarSign } from "lucide-react";
import AdminLogin from "./login";
import UsedIphonesManager from "@/components/admin/used-iphones-manager";
import PriceManager from "@/components/admin/price-manager";
import ProductManager from "@/components/admin/product-manager";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import BulkPriceUpload from "@/components/admin/bulk-price-upload";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("adminAuth") === "true"
  );

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">پنل مدیریت</h1>
            <p className="text-sm text-muted-foreground">پرشین اپل استور گیشا</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="ml-2 h-4 w-4" />
            خروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">گوشی‌های کارکرده</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">محصولات</p>
                <p className="text-2xl font-semibold">120+</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">آخرین بروزرسانی</p>
                <p className="text-lg font-medium">امروز</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              آمار بازدید
            </TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">
              مدیریت محصولات
            </TabsTrigger>
            <TabsTrigger value="used-iphones" data-testid="tab-used-iphones">
              گوشی‌های کارکرده
            </TabsTrigger>
            <TabsTrigger value="prices" data-testid="tab-prices">
              قیمت‌ها
            </TabsTrigger>
            <TabsTrigger value="bulk-upload" data-testid="tab-bulk-upload">
              آپلود دسته‌جمعی
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="used-iphones">
            <UsedIphonesManager />
          </TabsContent>

          <TabsContent value="prices">
            <PriceManager />
          </TabsContent>

          <TabsContent value="bulk-upload">
            <BulkPriceUpload />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
