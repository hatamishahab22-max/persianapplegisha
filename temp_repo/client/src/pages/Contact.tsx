import { Link } from "wouter";
import { Phone, MapPin, ArrowRight } from "lucide-react";
import contactImage from "@assets/IMG_6520_1762994134814.jpeg";

export default function Contact() {
  const openGoogleMaps = () => {
    // تهران، گیشا، بازار بزرگ نصر، پلاک ۲۶۱
    const address = "Tehran, Gisha, Nasr Grand Bazaar, Unit 261";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${contactImage})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Back Button */}
      <div className="relative z-10 p-4">
        <Link href="/">
          <button 
            className="text-white hover:opacity-80 transition-opacity bg-transparent border-0 flex items-center gap-2 p-2"
            data-testid="button-back-home"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-lg">بازگشت</span>
          </button>
        </Link>
      </div>

      {/* Contact Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 pb-20">
        <div className="max-w-2xl w-full space-y-6">
          {/* Phone Numbers */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover:bg-white/15 transition-colors">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-3">تلفن تماس</h3>
                <a 
                  href="tel:+982188286777" 
                  className="text-white/90 text-xl block mb-2 hover:text-white transition-colors"
                  data-testid="link-phone-1"
                >
                  ۰۲۱-۸۸۲۸۶۷۷۷
                </a>
                <a 
                  href="tel:+989121149079" 
                  className="text-white/90 text-lg block mb-2 hover:text-white transition-colors"
                  data-testid="link-phone-2"
                >
                  ۰۹۱۲-۱۱۴۹۰۷۹ (شهاب)
                </a>
                <a 
                  href="tel:+989126782809" 
                  className="text-white/90 text-lg block hover:text-white transition-colors"
                  data-testid="link-phone-3"
                >
                  ۰۹۱۲-۶۷۸۲۸۰۹ (شروین)
                </a>
              </div>
            </div>
          </div>

          {/* Address with Location */}
          <div 
            onClick={openGoogleMaps}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover:bg-white/15 transition-colors cursor-pointer"
            data-testid="button-location"
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2">آدرس</h3>
                <p className="text-white/90 text-lg leading-relaxed mb-2" data-testid="text-address">
                  تهران، گیشا، بازار بزرگ نصر، پلاک ۲۶۱
                </p>
                <p className="text-white/70 text-sm">
                  کلیک کنید برای مشاهده در نقشه
                </p>
              </div>
            </div>
          </div>

          {/* Store Name */}
          <div className="text-center pt-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              پرشین اپل استور گیشا
            </h2>
            <p className="text-white/80 mt-2">
              فروشگاه معتبر محصولات اصل اپل در تهران
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
