import { MetadataRoute } from "next";
import { CURRENT_YEAR } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "http://localhost:3000";

  // Generate monthly calendar URLs for better SEO
  const monthlyUrls = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      url: `${baseUrl}/calendar?month=${month}&year=${CURRENT_YEAR}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
  });

  // Static routes - Important pages for sitelinks
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/calendar`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    // Add monthly calendar URLs
    ...monthlyUrls,
  ];

  return routes;
}
