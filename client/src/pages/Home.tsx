import heroImage from "@assets/IMG_6524_1763105170711.jpeg";
import logoImage from "@assets/IMG_4148_1763105490467.png";
import { Link } from "wouter";
import { MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Home() {
  const handleWhatsAppShare = () => {
    const text = "پرشین اپل استور - بهترین محصولات اپل در تهران";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Background Image */}
      <div 
        className="h-full w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Content - Logo at top, Menu below it */}
        <div className="relative z-10 h-full flex flex-col items-center pt-12 px-4">
          {/* Logo at Top */}
          <div className="mb-12">
            <img 
              src={logoImage} 
              alt="Persian Apple Store" 
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* Horizontal Glass Menu Below Logo */}
          <nav className="flex gap-4">
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
      </div>

      {/* WhatsApp & AI Chat Buttons - Bottom Right Corner */}
      <div className="absolute bottom-6 right-6 flex gap-3 z-30">
        <button 
          onClick={handleWhatsAppShare}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer bg-green-500"
          data-testid="button-whatsapp"
        >
          <FaWhatsapp className="w-7 h-7 text-white" />
        </button>
        
        <button 
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-0 cursor-pointer"
          style={{ backgroundColor: '#D64218' }}
          data-testid="button-ai-chat"
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
