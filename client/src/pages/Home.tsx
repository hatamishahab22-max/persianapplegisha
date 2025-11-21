import { useState, useEffect } from "react";
import logoImage from "@assets/IMG_4148_1763105490467.png";
import videoFile from "@assets/video-output-597A6071-A019-439B-9B22-BF4D6A546A02-1_1763702148716.mov";
import { Link } from "wouter";
import { MessageCircle, Clock } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Home() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppShare = () => {
    const text = "پرشین اپل استور - بهترین محصولات اپل در تهران";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="h-screen w-full overflow-hidden relative font-['Vazirmatn']">
      {/* Background Video */}
      <video 
        className="h-full w-full object-cover absolute inset-0"
        autoPlay 
        muted 
        loop 
        playsInline
        data-testid="video-background"
      >
        <source src={videoFile} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Clock in Top Right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20" data-testid="display-clock">
        <Clock className="w-5 h-5 text-white" />
        <span className="text-white font-bold text-lg" dir="ltr">{time}</span>
      </div>
        
      {/* Content - Logo at top, Menu below it */}
      <div className="relative z-10 h-full flex flex-col items-center pt-12 px-4">
        {/* Logo at Top */}
        <div className="mb-12">
          <img 
            src={logoImage} 
            alt="Persian Apple Store" 
            className="h-16 md:h-20 w-auto"
            data-testid="img-logo"
          />
        </div>

        {/* Horizontal Glass Menu Below Logo */}
        <nav className="flex gap-4 flex-wrap justify-center">
          <Link href="/products">
            <button 
              className="px-12 py-5 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-2xl text-white text-2xl font-bold w-52"
              data-testid="link-products"
            >
              محصولات
            </button>
          </Link>
          
          <Link href="/contact">
            <button 
              className="px-12 py-5 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-2xl text-white text-2xl font-bold w-52"
              data-testid="link-contact"
            >
              تماس با ما
            </button>
          </Link>
        </nav>
      </div>

      {/* Social Media & Chat Buttons - Bottom Right Corner */}
      <div className="absolute bottom-6 right-6 flex gap-3 z-30">
        {/* WhatsApp */}
        <a 
          href="https://wa.me/989121149079"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer bg-green-500"
          data-testid="button-whatsapp"
          title="واتس‌اپ"
        >
          <FaWhatsapp className="w-7 h-7 text-white" />
        </a>

        {/* Instagram */}
        <a 
          href="https://instagram.com/persianapple.gisha"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          data-testid="button-instagram"
          title="اینستاگرام"
        >
          <FaInstagram className="w-7 h-7 text-white" />
        </a>
        
        {/* AI Chat / Message */}
        <button 
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer"
          style={{ backgroundColor: '#D64218' }}
          data-testid="button-ai-chat"
          title="پیام"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Admin Link - Bottom Left Corner */}
      <Link href="/admin/login">
        <button 
          className="absolute bottom-6 left-6 text-white/30 text-sm hover:text-white/50 transition-colors bg-transparent border-0 p-2 z-30"
          data-testid="link-admin-hidden"
        >
          مدیریت
        </button>
      </Link>
    </div>
  );
}
