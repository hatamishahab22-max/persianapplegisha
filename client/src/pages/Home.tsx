import { useState, useEffect } from "react";
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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Top Section - Title and Buttons */}
      <div className="relative z-10 flex flex-col items-center pt-8 px-4 gap-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white drop-shadow-lg text-center">Persian Apple Store</h1>
        
        {/* Buttons */}
        <nav className="flex gap-4">
          <Link href="/products">
            <button 
              className="px-8 py-3 rounded-lg backdrop-blur-lg bg-white/15 border border-white/40 hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-lg text-white font-bold"
              data-testid="link-products"
            >
              محصولات
            </button>
          </Link>
          
          <Link href="/contact">
            <button 
              className="px-8 py-3 rounded-lg backdrop-blur-lg bg-white/15 border border-white/40 hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-lg text-white font-bold"
              data-testid="link-contact"
            >
              تماس با ما
            </button>
          </Link>
        </nav>
      </div>

      {/* Center - Large Apple Logo Circle */}
      <div className="absolute inset-0 flex items-center justify-center z-5">
        <div className="w-64 h-64 rounded-full bg-white/90 shadow-2xl flex items-center justify-center">
          <svg className="w-40 h-40 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.29.88 3.08.88.9 0 2.31-1.1 3.76-.92 1.64.2 2.92.98 3.77 2.46-3.6 2.16-2.88 6.42.5 7.71-.66 1.84-2.08 2.84-3.11 3.54zm-5.4-18.3c.34-1.34.73-3.1 1.97-3.55.24 1.74-.36 3.21-1.97 3.55z"/>
          </svg>
        </div>
      </div>

      {/* Bottom Section - Social Media Icons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-30">
        {/* Location */}
        <a 
          href="https://maps.google.com/?q=تهران+گیشا+بازار+بزرگ+نصر+پلاک+261"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer overflow-hidden"
          data-testid="button-location"
          title="نشانی"
        >
          <img src={locationIcon} alt="Location" className="w-full h-full object-cover" />
        </a>

        {/* Phone / Contact */}
        <a 
          href="tel:+989121149079"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer bg-blue-500"
          data-testid="button-phone"
          title="تماس"
        >
          <Phone className="w-7 h-7 text-white" />
        </a>
        
        {/* Instagram */}
        <a 
          href="https://instagram.com/persianapple.gisha"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer overflow-hidden"
          data-testid="button-instagram"
          title="اینستاگرام"
        >
          <img src={instagramIcon} alt="Instagram" className="w-full h-full object-cover" />
        </a>

        {/* WhatsApp */}
        <a 
          href="https://wa.me/989121149079"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer overflow-hidden"
          data-testid="button-whatsapp"
          title="واتس‌اپ"
        >
          <img src={whatsappIcon} alt="WhatsApp" className="w-full h-full object-cover" />
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
