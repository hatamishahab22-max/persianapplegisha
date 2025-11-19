import { Card } from "@/components/ui/card";
import { ArrowRight, Battery, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { usePageTracking } from "@/hooks/use-page-tracking";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import type { UsedIphone } from "@shared/schema";

export default function UsedIphonesPage() {
  usePageTracking("used-iphones", "/used-iphones");
  useScrollToTop();
  const { data: usedIphones = [], isLoading } = useQuery<UsedIphone[]>({
    queryKey: ["/api/used-iphones"],
  });

  const getBatteryColor = (health: number) => {
    if (health >= 90) return "text-green-500";
    if (health >= 80) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4" data-testid="link-back-home">
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>
          <h1 className="text-4xl font-semibold mb-2">آیفون‌های کارکرده</h1>
          <p className="text-muted-foreground">گوشی‌های کارکرده با ضمانت سلامت</p>
        </div>

        {isLoading ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>در حال بارگذاری...</p>
            </div>
          </Card>
        ) : usedIphones.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">در حال حاضر موجودی نداریم</p>
              <p className="text-sm">لطفاً بعداً مراجعه کنید یا با ما تماس بگیرید</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usedIphones.map((phone) => (
              <Card key={phone.id} className="overflow-hidden hover-elevate transition-all" data-testid={`card-used-iphone-${phone.id}`}>
                {/* Images Gallery */}
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {/* Main Image with Gallery */}
                  <div className="w-full h-full">
                    <img
                      src={phone.imageUrl1}
                      alt={`${phone.model} ${phone.color} - تصویر 1`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  
                  {/* Thumbnail Strip (if there are multiple images) */}
                  {(phone.imageUrl2 || phone.imageUrl3) && (
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      {phone.imageUrl2 && (
                        <div className="w-12 h-12 rounded border-2 border-background overflow-hidden bg-background">
                          <img
                            src={phone.imageUrl2}
                            alt={`${phone.model} - تصویر 2`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {phone.imageUrl3 && (
                        <div className="w-12 h-12 rounded border-2 border-background overflow-hidden bg-background">
                          <img
                            src={phone.imageUrl3}
                            alt={`${phone.model} - تصویر 3`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Battery Health Badge */}
                  <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                    <Battery className={`h-4 w-4 ${getBatteryColor(phone.batteryHealth)}`} />
                    <span className="text-sm font-medium">{phone.batteryHealth}%</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{phone.model}</h3>
                    <p className="text-sm text-muted-foreground">
                      {phone.color} - {phone.storage}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">وضعیت:</span>
                      <span className="font-medium">{phone.condition}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {phone.description}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">قیمت:</span>
                      <span className="text-2xl font-semibold font-mono">
                        {phone.price.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                    <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover-elevate active-elevate-2 h-10 px-4 py-2 min-h-10" data-testid={`button-call-for-${phone.id}`}>
                      تماس برای خرید
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
