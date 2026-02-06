import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

export const runtime = "nodejs"; // ✅ ổn định nhất
export const revalidate = 0;

const GA_ENDPOINT = "https://analyticsdata.googleapis.com/v1beta";

let cache: {
  value: number;
  time: number;
} | null = null;

const CACHE_TTL = 10_000; // 10s

async function getAccessToken() {
  const base64 = process.env.GA_SERVICE_ACCOUNT_CREDENTIALS!;
  const json = Buffer.from(base64, "base64").toString("utf-8");
  const credentials = JSON.parse(json);

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  return token.token;
}

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!propertyId) {
    return NextResponse.json({
      activeUsers: 0,
      message: "GA_PROPERTY_ID not configured",
    });
  }

  // ✅ Cache để tránh spam GA API
  if (cache && Date.now() - cache.time < CACHE_TTL) {
    return NextResponse.json({
      activeUsers: cache.value,
      cached: true,
      message: `Cached value (TTL: ${Math.round((CACHE_TTL - (Date.now() - cache.time)) / 1000)}s left)`,
    });
  }

  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      `${GA_ENDPOINT}/properties/${propertyId}:runRealtimeReport`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          metrics: [{ name: "activeUsers" }],
        }),
      },
    );

    const data = await res.json();
    const activeUsers = Number(data?.rows?.[0]?.metricValues?.[0]?.value) || 0;

    cache = {
      value: activeUsers,
      time: Date.now(),
    };

    return NextResponse.json({
      activeUsers,
      cached: false,
      message: "Fetched from GA API",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("GA realtime error:", err);
    return NextResponse.json({
      activeUsers: 0,
      message: "Error fetching from GA API",
    });
  }
}
