import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">پرشین اپل استور گیشا</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              مرجع تخصصی فروش محصولات اپل با بهترین قیمت و کیفیت در تهران
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/iphone" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-iphone">
                  iPhone
                </Link>
              </li>
              <li>
                <Link href="/ipad" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-ipad">
                  iPad
                </Link>
              </li>
              <li>
                <Link href="/airpod" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-airpod">
                  AirPods
                </Link>
              </li>
              <li>
                <Link href="/used-iphones" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-used">
                  آیفون‌های کارکرده
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">تماس با ما</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>تهران، گیشا، بازار بزرگ نصر</li>
              <li dir="ltr" className="text-right font-mono">۰۲۱-۸۸۲۸۶۷۷۷</li>
              <li dir="ltr" className="text-right font-mono">۰۹۱۲-۱۱۴۹۰۷۹</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} پرشین اپل استور گیشا. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
