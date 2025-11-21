import { useState, useEffect } from "react";
import videoFile from "@assets/video-output-597A6071-A019-439B-9B22-BF4D6A546A02-1_1763702148716.mov";
import instagramIcon from "@assets/photo-output_1763702787471.png";
import whatsappIcon from "@assets/photo-output_1763702810818.png";
import locationIcon from "@assets/photo-output_1763702984960.png";
import logoImage from "@assets/a87b21c6-86b6-44fc-a01c-c6759e712c0b_1763764875125.jpeg";
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
