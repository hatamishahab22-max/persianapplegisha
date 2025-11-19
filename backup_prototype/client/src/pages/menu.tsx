import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import cafeBg from "@assets/stock_images/blurred_cafe_interio_86b9cf9c.jpg";
import iphoneImg from "@assets/stock_images/orange_iphone_14_pro_5208095f.jpg";

export default function Menu() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative font-['Vazirmatn'] overflow-hidden flex flex-col" dir="rtl">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${cafeBg})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 py-8">
        
        {/* Header Logo */}
        <div className="w-full flex justify-center mb-12 mt-4">
          <div className="relative">
            <div className="border-t-2 border-b-2 border-white/20 py-2 px-8">
               <h1 className="text-2xl md:text-3xl font-bold text-white/90 uppercase tracking-widest text-center">
                 Persian Apple Store
               </h1>
            </div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setLocation("/contact")}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl py-6 text-white text-xl font-bold hover:bg-white/20 transition-all active:scale-95"
          >
            تماس با ما
          </button>
          
          <button 
             onClick={() => setLocation("/products")}
             className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl py-6 text-white text-xl font-bold hover:bg-white/20 transition-all active:scale-95"
          >
            محصولات
          </button>
        </div>

        {/* iPhone Image */}
        <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
          <div className="relative w-64 h-[450px] rounded-[40px] overflow-hidden shadow-2xl transform rotate-[-5deg] border-4 border-[#e08132]/50">
            <img 
              src={iphoneImg} 
              alt="Orange iPhone" 
              className="w-full h-full object-cover"
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-end mt-4 pb-4">
           <span className="text-white/50 text-sm font-light">مدیریت</span>
           
           <div className="flex gap-4">
             {/* Message Button */}
             <a 
               href="#"
               className="w-14 h-14 rounded-full bg-[#e65c3c] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
             >
               <MessageCircle className="text-white w-7 h-7" />
             </a>
             
             {/* WhatsApp Button */}
             <a 
               href="https://wa.me/989121149079"
               className="w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
             >
               <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
             </a>
           </div>
        </div>

      </div>
    </div>
  );
}
