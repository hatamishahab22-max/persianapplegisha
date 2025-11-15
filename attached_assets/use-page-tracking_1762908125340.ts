import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

export function usePageTracking(pageName: string, path: string) {
  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await apiRequest("/api/visits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pageName,
            path: path,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        // Silently fail - tracking shouldn't break the app
        console.debug("Page tracking failed:", error);
      }
    };

    trackVisit();
  }, [pageName, path]);
}
