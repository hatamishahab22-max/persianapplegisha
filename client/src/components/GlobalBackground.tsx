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
  const preloadedRef = useRef(new Set<string>());

  // Defer preload to prevent blocking initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      const allBackgrounds = getAllBackgrounds();
      Object.values(allBackgrounds).forEach(url => {
        if (!preloadedRef.current.has(url)) {
          const img = new Image();
          img.src = url;
          preloadedRef.current.add(url);
        }
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Instant switch when background changes (already preloaded)
  useEffect(() => {
    if (backgroundUrl !== currentBg) {
      // Check if already preloaded
      if (preloadedRef.current.has(backgroundUrl)) {
        setCurrentBg(backgroundUrl);
      } else {
        // Fallback: load if not preloaded yet
        const img = new Image();
        img.src = backgroundUrl;
        img.onload = () => {
          setCurrentBg(backgroundUrl);
          preloadedRef.current.add(backgroundUrl);
        };
      }
    }
  }, [backgroundUrl, currentBg]);

  return (
    <div 
      className="fixed inset-0 bg-cover bg-center transition-opacity duration-500 -z-10"
      style={{ 
        backgroundImage: `url(${currentBg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
