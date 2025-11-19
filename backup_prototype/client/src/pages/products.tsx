import { useLocation } from "wouter";
import { ChevronLeft, Circle } from "lucide-react";
import { AppleIdDialog } from "@/components/apple-id-dialog";

export default function Products() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black font-['Vazirmatn'] text-white p-6 pb-10" dir="rtl">
      
      {/* Header with Back Button */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={() => setLocation("/menu")}
          className="flex items-center gap-2 text-white text-lg hover:text-gray-300 transition-colors"
        >
          <span>بازگشت</span>
          <ChevronLeft />
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-md mx-auto">
        
        {/* Card 1: iPhone (Purple/Blue Gradient) */}
        <div className="relative overflow-hidden rounded-[32px] h-48 bg-gradient-to-br from-[#a855f7] to-[#3b82f6] p-6 flex flex-col justify-between shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
           <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-4 h-4 bg-white/80 rounded-full" />
           </div>
           
           <div className="mt-8">
             <h2 className="text-3xl font-bold mb-2">آیفون</h2>
             <p className="text-white/90 text-sm">جدیدترین مدل‌های آیفون با گارانتی معتبر</p>
           </div>

           <div className="flex items-center gap-2 text-sm font-medium self-end mt-auto">
             <span>مشاهده محصولات</span>
             <ChevronLeft className="w-4 h-4" />
           </div>
        </div>

        {/* Card 2: Corporate Registry (Red/Pink Gradient) */}
        <div className="relative overflow-hidden rounded-[32px] h-48 bg-gradient-to-br from-[#f97316] to-[#ec4899] p-6 flex flex-col justify-between shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
           <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-4 h-4 bg-white/80 rounded-full" />
           </div>
           
           <div className="mt-8">
             <h2 className="text-3xl font-bold mb-2">رجیستری شرکتی</h2>
             <p className="text-white/90 text-sm">آیفون‌های رجیستر شده شرکتی با قیمت ویژه</p>
           </div>

           <div className="flex items-center gap-2 text-sm font-medium self-end mt-auto">
             <span>مشاهده محصولات</span>
             <ChevronLeft className="w-4 h-4" />
           </div>
        </div>

        {/* Card 3: Used iPhone (Orange/Yellow Gradient) */}
        <div className="relative overflow-hidden rounded-[32px] h-48 bg-gradient-to-br from-[#eab308] to-[#f97316] p-6 flex flex-col justify-between shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
           <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-4 h-4 bg-white/80 rounded-full" />
           </div>
           
           <div className="mt-8">
             <h2 className="text-3xl font-bold mb-2">آیفون کارکرده</h2>
             <p className="text-white/90 text-sm">گوشی‌های موجود و سفارش مشتری</p>
           </div>

           <div className="flex items-center gap-2 text-sm font-medium self-end mt-auto">
             <span>مشاهده محصولات</span>
             <ChevronLeft className="w-4 h-4" />
           </div>
        </div>

        {/* Special: Apple ID Button (Re-using the dialog functionality but with a new look if needed, or just a button) */}
        <div className="mt-4">
            <AppleIdDialog /> 
            {/* Note: The AppleIdDialog component currently renders a button. 
                I might need to adjust it to fit this list if the user wants it here.
                For now, I'll leave it as an additional option or maybe integrate it into "Products" later.
                But based on the screenshot, there are only 3 main cards. 
                I will keep it available but maybe as a floating button or separate. 
                Actually, the user asked for "Apple ID" specifically earlier. 
                I'll assume it might be inside one of these categories or a separate service.
                For now, I will just stick to the screenshot design.
            */}
        </div>

      </div>
    </div>
  );
}
