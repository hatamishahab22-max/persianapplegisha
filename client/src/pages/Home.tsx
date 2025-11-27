import { useState, useEffect } from "react";
import videoFile from "@assets/video-output-597A6071-A019-439B-9B22-BF4D6A546A02-1_1763702148716.mov";
import instagramIcon from "@assets/photo-output_1763702787471.png";
import whatsappIcon from "@assets/photo-output_1763702810818.png";
import locationIcon from "@assets/photo-output_1763702984960.png";
import logoImage from "@assets/a87b21c6-86b6-44fc-a01c-c6759e712c0b_1763764875125.jpeg";
import { Link } from "wouter";
import { Phone, Sparkles } from "lucide-react";
import { InstallButton } from "@/components/InstallButton";

export default function Home() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "";
    setUserName(name);
  }, []);

  // Track referrals
  useEffect(() => {
    const trackReferral = async () => {
      // Check if already tracked this session
      const alreadyTracked = sessionStorage.getItem("referralTracked");
      if (alreadyTracked) return;

      // Get ref parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const refSource = urlParams.get("ref");

      // If no ref parameter, track as "direct"
      const source = refSource || "direct";

      // Generate a session ID if not exists
      let sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("sessionId", sessionId);
      }

      try {
        await fetch("/api/referrals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source,
            sessionId,
            landingPage: window.location.pathname + window.location.search,
          }),
        });

        // Mark as tracked for this session
        sessionStorage.setItem("referralTracked", "true");
      } catch (error) {
        console.error("Failed to track referral:", error);
      }
    };

    trackReferral();
  }, []);

  const handleShareWhatsApp = () => {
    // Get or create session ID for referral tracking
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem("sessionId", sessionId);
    }

    // Create referral link with unique session ID
    const referralLink = `${window.location.origin}/?ref=${sessionId}`;
    
    // WhatsApp share message
    const message = `سلام! 👋\n\nبهترین فروشگاه محصولات اپل در تهران رو پیدا کردم! 🍎\n\n📱 آیفون، آیپد، ایرپاد و...\n💯 محصولات اصل و گارانتی معتبر\n🎯 قیمت‌های عالی\n\nحتما چک کن:\n${referralLink}\n\n📍 آدرس: تهران، گیشا، بازار بزرگ نصر`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="h-screen w-full overflow-hidden relative bg-black font-['Vazirmatn']">
      {/* Install Button */}
      <InstallButton />

      {/* Background Video */}
      <video 
        className="h-full w-full object-cover absolute inset-0"
        autoPlay 
        muted 
        loop 
        playsInline
        preload="auto"
        poster="/attached_assets/a87b21c6-86b6-44fc-a01c-c6759e712c0b_1763764875125.jpeg"
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
        <nav className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
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
          </div>
          
          {/* Dream Deals Button */}
          <Link href="/dream-deals">
            <button 
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-purple-500/80 to-pink-500/80 border border-purple-400/60 hover:from-purple-500/90 hover:to-pink-500/90 transition-all duration-300 shadow-lg text-white font-semibold animate-pulse"
              data-testid="button-dream-deals"
            >
              <Sparkles className="w-4 h-4" />
              <span>پیشنهاد رویایی</span>
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
