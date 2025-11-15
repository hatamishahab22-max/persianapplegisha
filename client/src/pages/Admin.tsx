import { Link, Route, Switch, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  DollarSign, 
  Smartphone, 
  BarChart, 
  ShoppingCart,
  Users,
  Settings,
  Home,
  MessageSquare,
  QrCode
} from "lucide-react";

import { lazy, Suspense } from "react";

// Lazy load admin components
const ProductManager = lazy(() => import("@/components/admin/product-manager"));
const PriceManager = lazy(() => import("@/components/admin/price-manager-simple"));
const UsedPhonesManager = lazy(() => import("@/components/admin/used-iphones-manager"));
const AnalyticsDashboard = lazy(() => import("@/components/admin/analytics-dashboard"));
const ErrorMonitor = lazy(() => import("@/components/admin/error-monitor"));
const WhatsappOrdersManager = lazy(() => import("@/components/admin/whatsapp-orders-manager"));
const SettingsManager = lazy(() => import("@/components/admin/settings-manager"));
const QRCodeGenerator = lazy(() => import("@/components/admin/qr-code-generator"));
const SeedDatabase = lazy(() => import("@/components/admin/seed-database"));

export default function Admin() {
  const [match, params] = useRoute("/admin/:section");
  
  const menuItems = [
    { 
      title: "داشبورد", 
      titleEn: "Dashboard",
      icon: BarChart, 
      path: "/admin/dashboard",
      description: "آمار و گزارشات فروشگاه"
    },
    { 
      title: "مدیریت محصولات", 
      titleEn: "Products",
      icon: Package, 
      path: "/admin/products",
      description: "افزودن و ویرایش محصولات"
    },
    { 
      title: "مدیریت قیمت‌ها", 
      titleEn: "Prices",
      icon: DollarSign, 
      path: "/admin/prices",
      description: "تنظیم قیمت‌ها و تخفیف‌ها"
    },
    { 
      title: "آیفون‌های کارکرده", 
      titleEn: "Used iPhones",
      icon: Smartphone, 
      path: "/admin/used-phones",
      description: "مدیریت گوشی‌های کارکرده"
    },
    { 
      title: "سفارشات واتساپ", 
      titleEn: "WhatsApp Orders",
      icon: MessageSquare, 
      path: "/admin/whatsapp-orders",
      description: "مدیریت سفارشات واتساپ مشتریان"
    },
    { 
      title: "مانیتورینگ خطاها", 
      titleEn: "Errors",
      icon: Settings, 
      path: "/admin/errors",
      description: "ردیابی و رفع خطاها"
    },
    { 
      title: "تنظیمات", 
      titleEn: "Settings",
      icon: Settings, 
      path: "/admin/settings",
      description: "تنظیمات فروشگاه و ظاهر"
    },
    { 
      title: "QR Code", 
      titleEn: "QR Code",
      icon: QrCode, 
      path: "/admin/qr-code",
      description: "تولید و دانلود QR Code سایت"
    },
    { 
      title: "Seed دیتابیس", 
      titleEn: "Seed Database",
      icon: Package, 
      path: "/admin/seed",
      description: "پر کردن دیتابیس با مدل‌ها و رنگ‌ها"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 min-h-screen bg-card border-l md:sticky md:top-0 md:h-screen overflow-auto" dir="rtl">
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              <Home className="h-5 w-5 md:h-6 md:w-6" />
              <h2 className="text-lg md:text-xl font-bold">پنل مدیریت</h2>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div 
                    data-testid={`link-admin-${item.titleEn.toLowerCase().replace(' ', '-')}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-accent cursor-pointer ${
                      window.location.pathname === item.path ? 'bg-accent' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <Link href="/">
                  <div 
                    data-testid="link-back-to-store"
                    className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-accent cursor-pointer"
                  >
                    <Home className="h-5 w-5" />
                    <span>بازگشت به فروشگاه</span>
                  </div>
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8" dir="rtl">
          <Suspense fallback={<div className="text-center py-8">در حال بارگذاری...</div>}>
            <Switch>
              <Route path="/admin/dashboard">
                <AnalyticsDashboard />
              </Route>
              <Route path="/admin/products">
                <ProductManager />
              </Route>
              <Route path="/admin/prices">
                <PriceManager />
              </Route>
              <Route path="/admin/used-phones">
                <UsedPhonesManager />
              </Route>
              <Route path="/admin/whatsapp-orders">
                <WhatsappOrdersManager />
              </Route>
              <Route path="/admin/errors">
                <ErrorMonitor />
              </Route>
              <Route path="/admin/settings">
                <SettingsManager />
              </Route>
              <Route path="/admin/qr-code">
                <QRCodeGenerator />
              </Route>
              <Route path="/admin/seed">
                <SeedDatabase />
              </Route>
              <Route>
                <DefaultDashboard menuItems={menuItems} />
              </Route>
            </Switch>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// Default Dashboard Component
function DefaultDashboard({ menuItems }: { menuItems: any[] }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">داشبورد مدیریت پرشین اپل استور</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div data-testid={`card-admin-${item.titleEn.toLowerCase().replace(' ', '-')}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <item.icon className="h-6 w-6 text-primary" />
                    <span>{item.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">۰</div>
            <p className="text-sm text-muted-foreground">محصولات فعال</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">۰</div>
            <p className="text-sm text-muted-foreground">سفارشات امروز</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">۰</div>
            <p className="text-sm text-muted-foreground">بازدید امروز</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">۰ تومان</div>
            <p className="text-sm text-muted-foreground">فروش امروز</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

