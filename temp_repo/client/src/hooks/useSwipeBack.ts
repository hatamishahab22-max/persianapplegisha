import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

interface SwipeBackOptions {
  threshold?: number;
  excludeSelectors?: string[];
}

export function useSwipeBack(options: SwipeBackOptions = {}) {
  const { threshold = 100, excludeSelectors = [] } = options;
  const [location, navigate] = useLocation();
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if touch started on excluded elements
      const isExcluded = excludeSelectors.some(selector => {
        return target.closest(selector) !== null;
      });
      
      if (isExcluded) {
        return;
      }

      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isSwiping.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current) return;

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      const diffX = touchEndX - touchStartX.current;
      const diffY = Math.abs(touchEndY - touchStartY.current);

      // Swipe from right to left (برای RTL یعنی برگشت به عقب)
      // Make sure horizontal movement is more than vertical
      if (diffX < -50 && diffY < 50) {
        isSwiping.current = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !isSwiping.current) {
        touchStartX.current = 0;
        touchStartY.current = 0;
        isSwiping.current = false;
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX.current;

      // Swipe from right to left with enough distance
      if (diffX < -threshold) {
        // Go back in history
        window.history.back();
      }

      touchStartX.current = 0;
      touchStartY.current = 0;
      isSwiping.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [threshold, excludeSelectors]);
}
