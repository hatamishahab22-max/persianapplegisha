import { MapPin, Phone, Mail } from "lucide-react";
import { SiInstagram, SiTelegram, SiWhatsapp } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">پرشین اپل استور گیشا</h3>
            <p className="text-sm text-muted-foreground mb-4">
              فروشگاه معتبر محصولات اصل اپل در تهران با بیش از ۱۰ سال سابقه
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg hover-elevate active-elevate-2 border"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover-elevate active-elevate-2 border"
                aria-label="Telegram"
                data-testid="link-telegram"
              >
                <SiTelegram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover-elevate active-elevate-2 border"
                aria-label="WhatsApp"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">لینک‌های سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  تماس با ما
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  قوانین و مقررات
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  حریم خصوصی
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">محصولات</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  آیفون
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  آیپد
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  مک بوک
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  اپل واچ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">اطلاعات تماس</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  تهران، خیابان ولیعصر، پلاک ۱۲۳۴
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground" dir="ltr">
                  021-1234-5678
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground" dir="ltr">
                  info@persianapple.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© ۱۴۰۳ پرشین اپل استور گیشا. تمامی حقوق محفوظ است.</p>
          <p className="flex items-center gap-2">
            <span>طراحی شده با</span>
            <span className="text-red-500">❤</span>
            <span>در تهران</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
