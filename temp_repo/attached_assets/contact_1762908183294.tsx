import { Card } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { usePageTracking } from "@/hooks/use-page-tracking";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function ContactPage() {
  usePageTracking("contact", "/contact");
  useScrollToTop();
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4" data-testid="link-back-home">
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>
          <h1 className="text-4xl font-semibold mb-2">تماس با ما</h1>
          <p className="text-muted-foreground">ما همیشه آماده پاسخگویی به شما هستیم</p>
        </div>

        <div className="space-y-6">
          {/* Address Card */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <a 
                href="https://maps.google.com/?q=تهران+گیشا+بازار+بزرگ+نصر"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-primary/10 shrink-0 hover-elevate active-elevate-2 transition-colors"
                data-testid="link-map"
              >
                <MapPin className="w-6 h-6 text-primary" />
              </a>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">آدرس فروشگاه</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-address">
                  تهران، گیشا، بازار بزرگ نصر، ورودی ۴، پلاک ۲۶۱
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  روی آیکون کلیک کنید تا در نقشه باز شود
                </p>
              </div>
            </div>
          </Card>

          {/* Phone Numbers Card */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-xl font-semibold">شماره‌های تماس</h2>
                
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground min-w-[80px]">تلفن ثابت:</span>
                    <div className="flex gap-3">
                      <a
                        href="tel:02188286777"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium font-mono hover-elevate active-elevate-2 bg-muted px-4 py-2 transition-colors"
                        data-testid="link-phone-1"
                      >
                        ۰۲۱-۸۸۲۸۶۷۷۷
                      </a>
                      <a
                        href="tel:02188287393"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium font-mono hover-elevate active-elevate-2 bg-muted px-4 py-2 transition-colors"
                        data-testid="link-phone-2"
                      >
                        ۰۲۱-۸۸۲۸۷۳۹۳
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground min-w-[80px]">شهاب:</span>
                    <a
                      href="tel:09121149079"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium font-mono hover-elevate active-elevate-2 bg-muted px-4 py-2 transition-colors w-fit"
                      data-testid="link-shahab"
                    >
                      ۰۹۱۲-۱۱۴۹۰۷۹
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground min-w-[80px]">شروین:</span>
                    <a
                      href="tel:09126782809"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium font-mono hover-elevate active-elevate-2 bg-muted px-4 py-2 transition-colors w-fit"
                      data-testid="link-shervin"
                    >
                      ۰۹۱۲-۶۷۸۲۸۰۹
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Business Hours */}
          <Card className="p-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">ساعات کاری</h2>
              <p className="text-muted-foreground">
                شنبه تا پنجشنبه: ۹ صبح تا ۸ شب
              </p>
              <p className="text-sm text-muted-foreground">
                جمعه‌ها تعطیل
              </p>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center p-6 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              برای مشاوره رایگان و دریافت قیمت دقیق محصولات با ما تماس بگیرید
            </p>
            <a
              href="tel:09121149079"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover-elevate active-elevate-2 h-10 px-8 py-2 min-h-10"
              data-testid="button-call-now"
            >
              <Phone className="ml-2 h-4 w-4" />
              تماس فوری
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
