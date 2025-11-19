import powerImage from "@assets/IMG_6565_1763093403861.jpeg";

interface SplashProps {
  onComplete?: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const handleClick = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-[#2C2C2C] cursor-pointer"
      onClick={handleClick}
      data-testid="splash-screen"
    >
      <img 
        src={powerImage} 
        alt="Power ON - کلیک کنید برای ورود" 
        className="max-w-[90%] max-h-[90%] object-contain"
      />
    </div>
  );
}
