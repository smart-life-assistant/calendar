import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 0;

// Google Analytics Data API endpoint
const GA_ENDPOINT = "https://analyticsdata.googleapis.com/v1beta";

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID;
  const apiKey = process.env.GA_API_KEY;

  if (!propertyId || !apiKey) {
    return NextResponse.json(
      { activeUsers: 0, error: "Missing GA credentials" },
      { status: 200 },
    );
  }

  try {
    const response = await fetch(
      `${GA_ENDPOINT}/properties/${propertyId}:runRealtimeReport?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metrics: [
            {
              name: "activeUsers",
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`GA API error: ${response.statusText}`);
    }

    const data = await response.json();
    const activeUsers = data?.rows?.[0]?.metricValues?.[0]?.value || 0;

    return NextResponse.json(
      {
        activeUsers: parseInt(activeUsers, 10),
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching GA realtime data:", error);
    return NextResponse.json(
      { activeUsers: 0, error: "Failed to fetch data" },
      { status: 200 },
    );
  }
}
