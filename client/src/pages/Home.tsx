import { useState, useEffect } from "react";
import videoFile from "@assets/video-output-597A6071-A019-439B-9B22-BF4D6A546A02-1_1763756743631.mov";
import instagramIcon from "@assets/photo-output_1763756743631.png";
import whatsappIcon from "@assets/photo-output_1763702810818.png";
import locationIcon from "@assets/photo-output_1763702984960.png";
import { Link } from "wouter";
import { Phone } from "lucide-react";

const logoImage = "/attached_assets/IMG_4148_1763756757943.PNG";

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
        <source src={videoFile} type="video/quicktime" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Top Section - Logo and Buttons */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-6 px-4">
        {/* Logo Image */}
        <div className="flex justify-center mb-8">
          <img 
            src={logoImage} 
            alt="Persian Apple Store" 
            className="w-auto h-10 object-contain"
            loading="eager"
            decoding="async"
            data-testid="img-logo"
          />
        </div>
        
        {/* Buttons */}
        <nav className="flex justify-center gap-4">
          <Link href="/contact">
            <button 
              className="px-8 py-3 rounded-2xl backdrop-blur-lg bg-white/20 border border-white/40 hover:bg-white/30 transition-all duration-300 shadow-lg text-white font-semibold"
              data-testid="link-contact"
            >
              تماس با ما
            </button>
          </Link>
          
          <Link href="/products">
            <button 
              className="px-8 py-3 rounded-2xl backdrop-blur-lg bg-white/20 border border-white/40 hover:bg-white/30 transition-all duration-300 shadow-lg text-white font-semibold"
              data-testid="link-products"
            >
              محصولات
            </button>
          </Link>
        </nav>
      </div>

      {/* Center - Large Apple Logo Circle with Gradient */}
      <div className="absolute inset-0 flex items-center justify-center z-5">
        <svg className="w-80 h-80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circleFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
            </linearGradient>
            <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E91E63" />
              <stop offset="33%" stopColor="#D81B60" />
              <stop offset="66%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#CDDC39" />
            </linearGradient>
          </defs>
          
          {/* Circle background */}
          <circle cx="100" cy="100" r="95" fill="url(#circleFill)" filter="drop-shadow(0 10px 30px rgba(0,0,0,0.3))" />
          
          {/* Apple logo with gradient */}
          <g transform="translate(100, 100)">
            <path d="M 0,-30 C -10,-30 -15,-20 -15,-10 C -15,0 -10,15 0,15 C 10,15 15,0 15,-10 C 15,-20 10,-30 0,-30 Z M -5,20 C -8,20 -10,22 -10,25 C -10,28 -8,30 -5,30 C -2,30 0,28 0,25 C 0,22 -2,20 -5,20 Z" 
                  fill="url(#appleGradient)" />
          </g>
        </svg>
      </div>

      {/* Bottom Section - Social Media Icons */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-5 z-30">
        {/* Location */}
        <a 
          href="https://maps.google.com/?q=تهران+گیشا+بازار+بزرگ+نصر+پلاک+261"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer overflow-hidden hover:shadow-xl"
          data-testid="button-location"
          title="نشانی"
        >
          <img src={locationIcon} alt="Location" className="w-full h-full object-cover" />
        </a>

        {/* Phone */}
        <a 
          href="tel:+989121149079"
          className="w-16 h-16 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer bg-blue-500 hover:shadow-xl flex items-center justify-center"
          data-testid="button-phone"
          title="تماس"
        >
          <Phone className="w-8 h-8 text-white" />
        </a>
        
        {/* Instagram */}
        <a 
          href="https://instagram.com/persianapple.gisha"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer overflow-hidden hover:shadow-xl"
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
          className="w-16 h-16 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer overflow-hidden hover:shadow-xl"
          data-testid="button-whatsapp"
          title="واتس‌اپ"
        >
          <img src={whatsappIcon} alt="WhatsApp" className="w-full h-full object-cover" />
        </a>
      </div>

      {/* Admin Link */}
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
