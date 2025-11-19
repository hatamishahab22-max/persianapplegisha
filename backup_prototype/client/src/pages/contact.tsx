import { useLocation } from "wouter";
import { ChevronLeft, Phone, MapPin, ArrowRight } from "lucide-react";
import lampImg from "@assets/stock_images/modern_hanging_lamp__f32973c6.jpg";

export default function Contact() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black font-['Vazirmatn'] text-white relative overflow-hidden" dir="rtl">
      
      {/* Lamp Spotlight Effect */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] z-0 flex justify-center pointer-events-none">
         {/* Lamp Image */}
         <img src={lampImg} alt="Lamp" className="h-full object-contain opacity-80 mix-blend-screen" />
         {/* CSS Spotlight Gradient */}
         <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/10 blur-[80px] rounded-full pointer-events-none" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={() => setLocation("/menu")}
          className="flex items-center gap-2 text-white text-lg hover:text-gray-300 transition-colors"
        >
          <span>بازگشت</span>
          <ArrowRight className="w-5 h-5 rotate-180" /> 
          {/* rotate-180 because rtl might flip it, but let's ensure it points left visually in LTR logic or right in RTL. 
              ChevronLeft usually points <. ArrowRight points >. 
              In the screenshot, it says "بازگشت ->". So arrow pointing to right (relative to text).
          */}
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 pt-[35vh] px-6 pb-10 max-w-md mx-auto flex flex-col gap-4">
        
        {/* Phone Card */}
        <div className="bg-[#1a1a1a] rounded-[24px] p-6 flex items-center justify-between shadow-lg border border-white/5">
           <div className="flex flex-col gap-2 text-right">
              <span className="text-lg font-bold text-white">تلفن تماس</span>
              <div className="text-gray-300 text-sm flex flex-col gap-1" dir="ltr">
                <span>021-88286777</span>
                <span>0912-1149079 (شهاب)</span>
                <span>0912-6782809 (شروین)</span>
              </div>
           </div>
           <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-300" />
           </div>
        </div>

        {/* Address Card */}
        <div className="bg-[#1a1a1a] rounded-[24px] p-6 flex items-center justify-between shadow-lg border border-white/5 cursor-pointer hover:bg-[#222] transition-colors">
           <div className="flex flex-col gap-2 text-right">
              <span className="text-lg font-bold text-white">آدرس</span>
              <p className="text-gray-300 text-sm leading-relaxed">
                تهران، گیشا، بازار بزرگ نصر، پلاک ۲۶۱
              </p>
              <span className="text-xs text-gray-500 mt-1">کلیک کنید برای مشاهده در نقشه</span>
           </div>
           <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-gray-300" />
           </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-bold mb-1">پرشین اپل استور گیشا</h3>
          <p className="text-gray-500 text-sm">فروشگاه معتبر محصولات اصل اپل در تهران</p>
        </div>

      </div>
    </div>
  );
}
