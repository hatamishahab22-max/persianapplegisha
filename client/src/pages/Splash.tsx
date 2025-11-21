import { useState } from "react";
import powerImage from "@assets/IMG_6565_1763093403861.jpeg";

interface SplashProps {
  onComplete?: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [firstName, setFirstName] = useState("");

  const handleClick = () => {
    if (firstName.trim()) {
      localStorage.setItem("userName", firstName);
    } else {
      localStorage.removeItem("userName");
    }
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-[#2C2C2C] cursor-pointer flex-col gap-8 p-4"
      data-testid="splash-screen"
    >
      {/* Name Input */}
      <div className="w-full max-w-sm space-y-4 mb-4" dir="rtl">
        <div>
          <input
            type="text"
            placeholder="نام (اختیاری)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors text-center font-['Vazirmatn']"
            data-testid="input-first-name"
          />
        </div>
      </div>

      {/* Power Button */}
      <div onClick={handleClick} className="cursor-pointer">
        <img 
          src={powerImage} 
          alt="Power ON - کلیک کنید برای ورود" 
          className="max-w-[90%] max-h-[90%] object-contain hover:scale-105 transition-transform"
        />
      </div>
    </div>
  );
}
