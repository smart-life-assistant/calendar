import { Metadata } from "next";
import { CURRENT_YEAR } from "./constants";

/**
 * Shared OpenGraph image configuration
 */
export const getOpenGraphImage = () => ({
  images: [
    {
      url: "/og-image.png",
      width: 1200,
      height: 675,
      alt: "Lịch Vạn Niên Việt Nam",
      type: "image/png",
    },
  ],
});

/**
 * Base OpenGraph configuration for the site
 */
export const getBaseOpenGraph = () => ({
  type: "website" as const,
  locale: "vi_VN",
  siteName: "Lịch Vạn Niên Việt Nam",
  ...getOpenGraphImage(),
});

/**
 * Generate OpenGraph metadata for a specific page
 */
export const generateOpenGraph = ({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) => ({
  ...getBaseOpenGraph(),
  title,
  description,
  url,
});

/**
 * Twitter card configuration
 */
export const getTwitterCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => ({
  card: "summary_large_image" as const,
  title,
  description,
});

/**
 * Common metadata for all pages
 */
export const getCommonMetadata = (): Partial<Metadata> => ({
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  formatDetection: {
    telephone: false,
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
});

/**
 * SEO-optimized metadata for home page
 */
export const getHomeMetadata = (): Metadata => ({
  ...getCommonMetadata(),
  title: {
    default: `Lịch Vạn Niên - Xem Lịch Âm Dương Việt Nam Online ${CURRENT_YEAR}`,
    template: "%s | Lịch Vạn Niên Việt Nam",
  },
  description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} - Tra cứu lịch âm dương chính xác, xem ngày tốt xấu, ngày lễ tết, can chi, giờ hoàng đạo. Lịch vạn niên online miễn phí, cập nhật liên tục, dễ sử dụng trên điện thoại và máy tính.`,
  keywords: [
    "lịch vạn niên",
    "lịch vạn niên việt nam",
    "xem lịch vạn niên",
    `lịch vạn niên ${CURRENT_YEAR}`,
    "lịch âm dương",
    "lịch việt nam",
    "lịch âm",
    "lịch dương",
    "tra cứu lịch vạn niên",
    "xem lịch âm",
    "ngày tốt xấu",
    "ngày lễ việt nam",
    "ngày tết việt nam",
    "can chi",
    "giờ hoàng đạo",
    "xem ngày",
    "lịch việt online",
    "âm lịch việt nam",
    "dương lịch âm lịch",
    "lịch vạn sự",
  ],
  authors: [{ name: "Lịch Việt Nam" }],
  creator: "Lịch Việt Nam",
  publisher: "Lịch Việt Nam",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: generateOpenGraph({
    title: `Lịch Vạn Niên Việt Nam ${CURRENT_YEAR} - Xem Lịch Âm Dương Online`,
    description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} online miễn phí. Tra cứu lịch âm dương chính xác, xem ngày tốt xấu, giờ hoàng đạo, can chi, ngày lễ tết Việt Nam. Cập nhật liên tục.`,
    url: "/",
  }),
  twitter: getTwitterCard({
    title: `Lịch Vạn Niên Việt Nam ${CURRENT_YEAR} - Xem Lịch Âm Dương Online`,
    description:
      "Xem lịch vạn niên Việt Nam online miễn phí. Tra cứu lịch âm dương, ngày tốt xấu, can chi, ngày lễ tết. Chính xác và dễ sử dụng.",
  }),
  verification: {
    google: "jThwvj02giCRVOyG3wTsmZhnJUfIBNmNoDF8fdCxA3w",
  },
});

/**
 * SEO-optimized metadata for calendar page
 */
export const getCalendarMetadata = (): Metadata => ({
  title: `Xem Lịch Vạn Niên ${CURRENT_YEAR} - Tra Cứu Âm Dương Lịch Việt Nam Online`,
  description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} online miễn phí. Tra cứu lịch âm dương chính xác, xem ngày tốt xấu theo âm lịch, can chi, giờ hoàng đạo, ngày lễ tết Việt Nam. Công cụ xem lịch vạn niên online chính xác nhất, cập nhật liên tục.`,
  keywords: [
    // Core keywords (quan trọng nhất)
    "lịch vạn niên",
    `lịch vạn niên ${CURRENT_YEAR}`,
    "lịch vạn niên việt nam",
    "tra cứu lịch vạn niên",
    "xem lịch vạn niên",
    "lịch âm dương",
    "âm dương lịch",
    "lịch âm",
    "lịch dương",
    "lịch việt nam",

    // High-intent search keywords (người dùng search nhiều)
    "xem lịch hôm nay",
    "hôm nay là ngày bao nhiêu",
    "hôm nay ngày tốt hay xấu",
    "giờ hoàng đạo hôm nay",
    "ngày hoàng đạo hôm nay",
    "ngày xấu hôm nay",
    "ngày tốt hôm nay",
    "xem lịch online",

    // Year-based keywords (SEO cực mạnh)
    `lịch năm ${CURRENT_YEAR}`,
    `lịch âm ${CURRENT_YEAR}`,
    `lịch dương ${CURRENT_YEAR}`,
    `lịch âm dương ${CURRENT_YEAR}`,
    `lịch vạn niên ${CURRENT_YEAR} việt nam`,
    `xem lịch ${CURRENT_YEAR}`,
    `xem lịch âm dương ${CURRENT_YEAR}`,
    `xem lịch vạn niên ${CURRENT_YEAR}`,

    // Month-based keywords
    `lịch tháng 1 ${CURRENT_YEAR}`,
    `lịch tháng 2 ${CURRENT_YEAR}`,
    `lịch tháng 3 ${CURRENT_YEAR}`,
    `lịch tháng 4 ${CURRENT_YEAR}`,
    `lịch tháng 5 ${CURRENT_YEAR}`,
    `lịch tháng 6 ${CURRENT_YEAR}`,
    `lịch tháng 7 ${CURRENT_YEAR}`,
    `lịch tháng 8 ${CURRENT_YEAR}`,
    `lịch tháng 9 ${CURRENT_YEAR}`,
    `lịch tháng 10 ${CURRENT_YEAR}`,
    `lịch tháng 11 ${CURRENT_YEAR}`,
    `lịch tháng 12 ${CURRENT_YEAR}`,

    // Lunar month keywords
    `lịch âm tháng 1 ${CURRENT_YEAR}`,
    `lịch âm tháng 2 ${CURRENT_YEAR}`,
    `lịch âm tháng 3 ${CURRENT_YEAR}`,
    `lịch âm tháng 4 ${CURRENT_YEAR}`,
    `lịch âm tháng 5 ${CURRENT_YEAR}`,
    `lịch âm tháng 6 ${CURRENT_YEAR}`,
    `lịch âm tháng 7 ${CURRENT_YEAR}`,
    `lịch âm tháng 8 ${CURRENT_YEAR}`,
    `lịch âm tháng 9 ${CURRENT_YEAR}`,
    `lịch âm tháng 10 ${CURRENT_YEAR}`,
    `lịch âm tháng 11 ${CURRENT_YEAR}`,
    `lịch âm tháng 12 ${CURRENT_YEAR}`,

    // Traditional calendar keywords
    "can chi",
    "thiên can địa chi",
    "ngũ hành",
    "tuổi âm lịch",
    "xem tuổi",
    "xem ngày tốt",
    "xem ngày xấu",
    "giờ hoàng đạo",
    "ngày hoàng đạo",
    "ngày hắc đạo",
    "lịch vạn sự",

    // Festival & event keywords (SEO rất tốt)
    "tết âm lịch",
    "tết dương lịch",
    "rằm",
    "mùng 1",
    "lễ tết việt nam",
    `tết ${CURRENT_YEAR} là ngày nào`,
    `rằm tháng giêng ${CURRENT_YEAR}`,
    `mùng 1 tết ${CURRENT_YEAR}`,

    // Long-tail keywords (Google rất thích)
    "tra cứu lịch âm dương online",
    "xem lịch âm dương chính xác",
    "lịch âm dương hôm nay",
    "xem ngày tốt xấu theo lịch âm",
    "tra cứu can chi ngày tháng năm",
    "xem giờ tốt trong ngày",
    "xem lịch miễn phí",
    "lịch việt nam online",

    // basic keywords
    "lịch",
    "xem lịch",
  ],
  openGraph: generateOpenGraph({
    title: `Xem Lịch Vạn Niên ${CURRENT_YEAR} - Tra Cứu Âm Dương Lịch Việt Nam Online`,
    description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} online miễn phí. Tra cứu lịch âm dương, can chi, ngày tốt xấu, giờ hoàng đạo, ngày lễ tết.`,
    url: "/calendar",
  }),
  twitter: getTwitterCard({
    title: `Xem Lịch Vạn Niên ${CURRENT_YEAR} - Tra Cứu Âm Dương Lịch Việt Nam Online`,
    description: `Xem lịch vạn niên Việt Nam ${CURRENT_YEAR} online miễn phí. Tra cứu lịch âm dương, can chi, ngày tốt xấu, giờ hoàng đạo, ngày lễ tết.`,
  }),
  alternates: {
    canonical: "/calendar",
  },
});

/**
 * SEO-optimized metadata for login page
 */
export const getLoginMetadata = (): Metadata => ({
  title: "Đăng Nhập - Lịch Vạn Niên Việt Nam",
  description:
    "Đăng nhập vào hệ thống quản lý lịch vạn niên Việt Nam. Quản lý lịch cá nhân, thêm sự kiện và ngày lễ riêng.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: generateOpenGraph({
    title: "Đăng Nhập - Lịch Vạn Niên Việt Nam",
    description:
      "Đăng nhập vào hệ thống quản lý lịch vạn niên Việt Nam. Quản lý lịch cá nhân, thêm sự kiện và ngày lễ riêng.",
    url: "/login",
  }),
});
