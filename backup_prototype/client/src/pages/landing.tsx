import { Power } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [_, setLocation] = useLocation();

  const handlePowerOn = () => {
    setLocation("/menu");
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden relative font-['Vazirmatn']">
      
      {/* Power Button Container */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#000] shadow-[-10px_-10px_30px_rgba(255,255,255,0.05),10px_10px_30px_rgba(0,0,0,0.8)] p-2 flex items-center justify-center">
          
          {/* Inner Ring */}
          <div className="w-full h-full rounded-full bg-[#111] shadow-[inset_5px_5px_15px_rgba(0,0,0,0.9),inset_-5px_-5px_15px_rgba(255,255,255,0.05)] p-6 flex items-center justify-center">
             
             {/* The Button Itself */}
             <button 
                onClick={handlePowerOn}
                className="w-full h-full rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#000] flex items-center justify-center group active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(0,0,0,0.8)] border border-[#222]"
             >
                <Power className="w-24 h-24 text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-300" strokeWidth={1.5} />
             </button>
          </div>
        </div>
      </div>

      {/* POWER ON Text */}
      <div className="mt-16 text-center select-none">
        <h1 className="text-[80px] font-bold leading-none text-[#1a1a1a] drop-shadow-[0_2px_0_rgba(255,255,255,0.05)]" style={{ textShadow: '0 -1px 1px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.05)' }}>
          POWER
        </h1>
        <h1 className="text-[120px] font-bold leading-none text-[#151515] drop-shadow-[0_2px_0_rgba(255,255,255,0.05)] -mt-4" style={{ textShadow: '0 -1px 1px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.05)' }}>
          ON
        </h1>
      </div>

    </div>
  );
}
