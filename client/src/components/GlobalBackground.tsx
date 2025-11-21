import { useBackgroundImage, type BackgroundCategory, getAllBackgrounds } from "@/hooks/use-background-image";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";

function getCategoryFromPath(path: string): BackgroundCategory {
  if (path.includes('/category/iphone') || path.includes('/product/iPhone')) {
    return 'iphone';
  }
  if (path.includes('/category/ipad') || path.includes('/product/iPad')) {
    return 'ipad';
  }
  if (path.includes('/category/airpods') || path.includes('/product/AirPods') || path.includes('ایرپاد')) {
    return 'airpods';
  }
  if (path.includes('/used-phone')) {
    return 'used';
  }
  return 'default';
}

export function GlobalBackground() {
  const [location] = useLocation();
  const category = getCategoryFromPath(location);
  const backgroundUrl = useBackgroundImage(category);
  const [currentBg, setCurrentBg] = useState(backgroundUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const preloadedRef = useRef(new Set<string>());

  // Immediate preload (no delay) - start as soon as component mounts
  useEffect(() => {
    const allBackgrounds = getAllBackgrounds();
    Object.values(allBackgrounds).forEach(url => {
      if (!preloadedRef.current.has(url)) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          preloadedRef.current.add(url);
        };
      }
    });
  }, []);

  // Load current background immediately
  useEffect(() => {
    setIsLoaded(false);
    
    if (preloadedRef.current.has(backgroundUrl)) {
      // Already loaded, show immediately
      setCurrentBg(backgroundUrl);
      setIsLoaded(true);
    } else {
      // Load it now
      const img = new Image();
      img.src = backgroundUrl;
      img.onload = () => {
        setCurrentBg(backgroundUrl);
        preloadedRef.current.add(backgroundUrl);
        setIsLoaded(true);
      };
      // Show immediately even if not loaded (browser will load it)
      setCurrentBg(backgroundUrl);
    }
  }, [backgroundUrl]);

  return (
    <div 
      className={`fixed inset-0 bg-cover bg-center -z-10 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        backgroundImage: `url(${currentBg})`,
        backgroundColor: '#000',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
