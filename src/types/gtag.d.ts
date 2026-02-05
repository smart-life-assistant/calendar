// Type definitions for Google Analytics
interface Window {
  gtag: (
    command: "config" | "event" | "js",
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer: any[];
}
