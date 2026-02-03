import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lịch Việt Nam - Tra Cứu Âm Dương Lịch, Ngày Lễ Tết Việt Nam",
    template: "%s | Lịch Việt Nam",
  },
  description:
    "Lịch Việt Nam online - Tra cứu lịch âm dương, lịch vạn niên, ngày lễ tết Việt Nam, ngày tốt xấu, can chi. Ứng dụng lịch Việt hiện đại, miễn phí, dễ sử dụng trên mọi thiết bị.",
  keywords: [
    "lịch việt nam",
    "lịch âm",
    "lịch dương",
    "lịch vạn niên",
    "âm dương lịch",
    "ngày lễ việt nam",
    "ngày tết việt nam",
    "can chi",
    "xem lịch âm",
    "tra cứu lịch",
    "lịch việt online",
    "lịch việt nam 2026",
  ],
  authors: [{ name: "Lịch Việt Nam" }],
  creator: "Lịch Việt Nam",
  publisher: "Lịch Việt Nam",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "Lịch Việt Nam - Tra Cứu Âm Dương Lịch, Ngày Lễ Tết Việt Nam",
    description:
      "Lịch Việt Nam online - Tra cứu lịch âm dương, lịch vạn niên, ngày lễ tết Việt Nam, ngày tốt xấu, can chi. Ứng dụng lịch Việt hiện đại, miễn phí, dễ sử dụng.",
    siteName: "Lịch Việt Nam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lịch Việt Nam - Tra Cứu Âm Dương Lịch, Ngày Lễ Tết Việt Nam",
    description:
      "Lịch Việt Nam online - Tra cứu lịch âm dương, lịch vạn niên, ngày lễ tết Việt Nam, can chi. Miễn phí và dễ sử dụng.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Thêm mã xác minh Google Search Console và Bing Webmaster Tools khi có
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Header />
            <main className="flex-1 flex flex-col bg-gradient-to-br from-background via-background/95 to-accent/5">
              {children}
            </main>
            <Footer />
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
