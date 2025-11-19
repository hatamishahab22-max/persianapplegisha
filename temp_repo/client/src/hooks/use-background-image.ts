import { useState, useEffect } from 'react';

const BACKGROUND_PREFIX = 'apple_store_background_';
const DEFAULT_BG = '/attached_assets/IMG_6628_1763162465034.jpeg';

export type BackgroundCategory = 'iphone' | 'ipad' | 'airpods' | 'used' | 'default';

export function useBackgroundImage(category: BackgroundCategory = 'default') {
  const [backgroundUrl, setBackgroundUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`${BACKGROUND_PREFIX}${category}`) || DEFAULT_BG;
    }
    return DEFAULT_BG;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newBg = localStorage.getItem(`${BACKGROUND_PREFIX}${category}`) || DEFAULT_BG;
      setBackgroundUrl(newBg);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('backgroundChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('backgroundChange', handleStorageChange);
    };
  }, [category]);

  return backgroundUrl;
}

export function setBackgroundImage(category: BackgroundCategory, url: string) {
  localStorage.setItem(`${BACKGROUND_PREFIX}${category}`, url);
  window.dispatchEvent(new Event('backgroundChange'));
}

export function getBackgroundImage(category: BackgroundCategory): string {
  if (typeof window === 'undefined') return DEFAULT_BG;
  return localStorage.getItem(`${BACKGROUND_PREFIX}${category}`) || DEFAULT_BG;
}

export function getAllBackgrounds(): Record<BackgroundCategory, string> {
  const categories: BackgroundCategory[] = ['iphone', 'ipad', 'airpods', 'used', 'default'];
  const backgrounds: Record<string, string> = {};
  
  categories.forEach(cat => {
    backgrounds[cat] = getBackgroundImage(cat);
  });
  
  return backgrounds as Record<BackgroundCategory, string>;
}
