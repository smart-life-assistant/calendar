"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";
import { pageview } from "@/lib/gtag";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Clean up old GA cookies that don't match current GA_TRACKING_ID
function cleanupOldGACookies() {
  if (typeof document === "undefined" || !GA_TRACKING_ID) return;

  const cookies = document.cookie.split(";");
  const currentGAId = GA_TRACKING_ID.replace("G-", "");

  cookies.forEach((cookie) => {
    const [name] = cookie.trim().split("=");
    // Remove old _ga_* cookies that don't match current GA ID
    if (name.startsWith("_ga_") && !name.includes(currentGAId)) {
      // Delete cookie for all possible domains
      const domains = ["", `.${window.location.hostname}`];
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ""}`;
      });
      console.log(`Cleaned up old GA cookie: ${name}`);
    }
  });
}

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Clean up old cookies on mount
    cleanupOldGACookies();
  }, []);

  useEffect(() => {
    if (pathname && GA_TRACKING_ID) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  // Validate GA ID format
  if (!GA_TRACKING_ID || !GA_TRACKING_ID.startsWith("G-")) {
    console.warn("Invalid or missing Google Analytics ID");
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onError={(e) => {
          console.error("Failed to load Google Analytics script:", e);
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}
