import { Link } from "wouter";
import { Smartphone, TabletSmartphone, Headphones, Package, Phone, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/use-page-tracking";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function Home() {
  usePageTracking("home", "/");
  useScrollToTop();
  const categories = [
    {
      id: "iphone",
      title: "iPhone",
      icon: Smartphone,
      description: "آیفون 16 و 17 با قیمت روز",
      href: "/iphone",
    },
    {
      id: "ipad",
      title: "iPad",
      icon: TabletSmartphone,
      description: "آیپد Air و Pro مدل‌های جدید",
      href: "/ipad",
    },
    {
      id: "airpod",
      title: "AirPods",
      icon: Headphones,
      description: "ایرپاد 3، 4 و Pro",
      href: "/airpod",
    },
    {
      id: "used",
      title: "آیفون کارکرده",
      icon: Package,
      description: "گوشی‌های کارکرده با ضمانت",
      href: "/used-iphones",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40 z-10" />
        
        {/* Hero background - will use stock image */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-accent/10" />
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            <img 
              src="/logo.png" 
              alt="Persian Apple Store" 
              className="h-16 md:h-20 mx-auto mb-4 opacity-90"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4">
            پرشین اپل استور گیشا
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            مرجع تخصصی فروش محصولات اپل با بهترین قیمت و کیفیت
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#categories" 
              className="inline-flex items-center justify-center rounded-md text-lg font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background hover-elevate active-elevate-2 h-14 px-12 py-3" 
              data-testid="button-browse-products"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              مشاهده محصولات
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background/50 backdrop-blur-sm hover-elevate active-elevate-2 h-10 px-8 py-2 min-h-10" data-testid="button-contact-us">
              <Phone className="ml-2 h-4 w-4" />
              تماس با ما
            </Link>
          </div>
          
          {/* Price notice */}
          <div className="mt-8 text-sm text-muted-foreground">
            <p>قیمت‌ها تقریبی می‌باشد - برای قیمت دقیق تماس بگیرید</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">دسته‌بندی محصولات</h2>
          <p className="text-muted-foreground">محصولات اپل را بر اساس نیاز خود انتخاب کنید</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={category.href} data-testid={`link-category-${category.id}`}>
                <Card className="p-8 hover-elevate active-elevate-2 transition-all cursor-pointer h-full group">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Share Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-muted-foreground">این برنامه رو با دوستانت به اشتراک بگذار</p>
            <Button
              onClick={() => {
                const shareUrl = window.location.origin;
                const shareText = "پرشین اپل استور گیشا - بهترین قیمت محصولات اپل";
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
                window.open(whatsappUrl, '_blank');
              }}
              variant="outline"
              size="lg"
              className="gap-2"
              data-testid="button-share-whatsapp"
            >
              <Share2 className="w-5 h-5" />
              اشتراک‌گذاری در واتساپ
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">ضمانت اصالت کالا</h3>
              <p className="text-sm text-muted-foreground">تمامی محصولات اورجینال و با گارانتی معتبر</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">بهترین قیمت روز</h3>
              <p className="text-sm text-muted-foreground">قیمت‌گذاری منصفانه و رقابتی</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">پشتیبانی حرفه‌ای</h3>
              <p className="text-sm text-muted-foreground">مشاوره رایگان قبل و بعد از خرید</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
