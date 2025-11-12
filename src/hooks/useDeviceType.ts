"use client";

import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const getDeviceType = (): DeviceType => {
      if (typeof window === "undefined") return "desktop";

      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();

      // Check for mobile devices
      const isMobileDevice =
        /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );

      // Check for tablets
      const isTabletDevice =
        /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);

      // Width-based detection
      if (width < 768) {
        return "mobile";
      } else if (width >= 768 && width < 1024) {
        return isTabletDevice || isMobileDevice ? "tablet" : "desktop";
      } else {
        return isTabletDevice ? "tablet" : "desktop";
      }
    };

    const handleResize = () => {
      setDeviceType(getDeviceType());
    };

    // Initial check
    handleResize();

    // Listen to resize with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return deviceType;
}

// Helper hook to check if mobile or tablet
export function useIsMobileOrTablet(): boolean {
  const deviceType = useDeviceType();
  return deviceType === "mobile" || deviceType === "tablet";
}
