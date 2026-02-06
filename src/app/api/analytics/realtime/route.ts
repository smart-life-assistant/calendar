import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 0;

// Google Analytics Data API endpoint
const GA_ENDPOINT = "https://analyticsdata.googleapis.com/v1beta";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

// Generate JWT and get access token from Service Account
async function getAccessToken() {
  const credentials = process.env.GA_SERVICE_ACCOUNT_CREDENTIALS;

  if (!credentials) {
    throw new Error("Missing GA_SERVICE_ACCOUNT_CREDENTIALS");
  }

  try {
    const serviceAccount = JSON.parse(
      Buffer.from(credentials, "base64").toString("utf-8"),
    );

    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = Buffer.from(
      JSON.stringify({ alg: "RS256", typ: "JWT" }),
    ).toString("base64url");

    const jwtClaimSet = Buffer.from(
      JSON.stringify({
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/analytics.readonly",
        aud: TOKEN_ENDPOINT,
        exp: now + 3600,
        iat: now,
      }),
    ).toString("base64url");

    const signatureInput = `${jwtHeader}.${jwtClaimSet}`;

    // Import private key for signing
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      Buffer.from(
        serviceAccount.private_key
          .replace(/-----BEGIN PRIVATE KEY-----/g, "")
          .replace(/-----END PRIVATE KEY-----/g, "")
          .replace(/\n/g, ""),
        "base64",
      ),
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"],
    );

    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      new TextEncoder().encode(signatureInput),
    );

    const jwt = `${signatureInput}.${Buffer.from(signature).toString("base64url")}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!propertyId || !process.env.GA_SERVICE_ACCOUNT_CREDENTIALS) {
    return NextResponse.json(
      { activeUsers: 0, error: "Missing GA credentials" },
      { status: 200 },
    );
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${GA_ENDPOINT}/${propertyId}:runRealtimeReport`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
      const errorText = await response.text();
      throw new Error(`GA API error: ${response.statusText} - ${errorText}`);
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
