import { useState, useEffect } from "react";
import logoImage from "@assets/photo-output_1763708892455.jpeg";
import videoFile from "@assets/video-output-597A6071-A019-439B-9B22-BF4D6A546A02-1_1763702148716.mov";
import instagramIcon from "@assets/photo-output_1763702787471.png";
import whatsappIcon from "@assets/photo-output_1763702810818.png";
import locationIcon from "@assets/photo-output_1763702984960.png";
import { Link } from "wouter";
import { Phone } from "lucide-react";

export default function Home() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "";
    setUserName(name);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden relative font-['Vazirmatn']">
      {/* Background Video */}
      <video 
        className="h-full w-full object-cover absolute inset-0"
        autoPlay 
        muted 
        loop 
        playsInline
        preload="auto"
        data-testid="video-background"
      >
        <source src={videoFile} type="video/mp4" />
      </video>

      {/* Dark Overlay - Light to preserve colors */}
      <div className="absolute inset-0 bg-black/10" />
      
        
      {/* Content - Logo and Menu at Top */}
      <div className="relative z-10 flex flex-col items-center pt-6 px-4 gap-4">
        {/* Logo - Small and at top */}
        <div className="flex flex-col items-center gap-3">
          <img 
            src={logoImage} 
            alt="Persian Apple Store" 
            className="h-20 w-20 rounded-full shadow-2xl"
            loading="eager"
            decoding="async"
            data-testid="img-logo"
          />
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">پرشی اپل</h1>
          {userName && (
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-sm" data-testid="display-welcome">
              <span className="text-white font-semibold">{userName} عزیز خوش آمدید</span>
            </div>
          )}
        </div>

        {/* Menu Buttons - Under Logo, Side by Side */}
        <nav className="flex gap-3">
          <Link href="/products">
            <button 
              className="px-6 py-2 rounded-lg backdrop-blur-lg bg-white/10 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg text-white font-bold"
              data-testid="link-products"
            >
              محصولات
            </button>
          </Link>
          
          <Link href="/contact">
            <button 
              className="px-6 py-2 rounded-lg backdrop-blur-lg bg-white/10 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg text-white font-bold"
              data-testid="link-contact"
            >
              تماس با ما
            </button>
          </Link>
        </nav>
      </div>

      {/* Social Media & Contact Buttons - Bottom Right Corner */}
      <div className="absolute bottom-6 right-6 flex gap-3 z-30">
        {/* WhatsApp */}
        <a 
          href="https://wa.me/989121149079"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer overflow-hidden"
          data-testid="button-whatsapp"
          title="واتس‌اپ"
        >
          <img src={whatsappIcon} alt="WhatsApp" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </a>

        {/* Instagram */}
        <a 
          href="https://instagram.com/persianapple.gisha"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer overflow-hidden"
          data-testid="button-instagram"
          title="اینستاگرام"
        >
          <img src={instagramIcon} alt="Instagram" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </a>
        
        {/* Phone / Contact */}
        <a 
          href="tel:+989121149079"
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer bg-blue-500"
          data-testid="button-phone"
          title="تماس"
        >
          <Phone className="w-8 h-8 text-white" />
        </a>

        {/* Location */}
        <a 
          href="https://maps.google.com/?q=تهران+گیشا+بازار+بزرگ+نصر+پلاک+261"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer overflow-hidden"
          data-testid="button-location"
          title="نشانی"
        >
          <img src={locationIcon} alt="Location" className="w-full h-full object-cover" />
        </a>
      </div>

      {/* Admin Link - Top Left Corner */}
      <Link href="/admin/login">
        <button 
          className="absolute top-6 left-6 text-white/30 text-sm hover:text-white/50 transition-colors bg-transparent border-0 p-2 z-30"
          data-testid="link-admin-hidden"
        >
          مدیریت
        </button>
      </Link>
    </div>
  );
}
