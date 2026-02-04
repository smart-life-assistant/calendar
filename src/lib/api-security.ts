import { NextRequest, NextResponse } from "next/server";

/**
 * Validates if the request is coming from an allowed origin
 */
export function validateApiAccess(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // Allowed origins (add your production domain here)
  const allowedOrigins = [
    "https://calendar-eight-beige.vercel.app",
    process.env.NEXT_PUBLIC_APP_URL,
    // For development
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ].filter(Boolean) as string[];

  // Check if it's a direct browser access (no origin header but has accept header for HTML)
  const accept = request.headers.get("accept") || "";
  const isDirectBrowserAccess =
    !origin && !referer && accept.includes("text/html");

  if (isDirectBrowserAccess) {
    return NextResponse.json(
      {
        error: "Direct API access is not allowed",
        message:
          "This API endpoint can only be accessed through the application",
      },
      { status: 403 },
    );
  }

  // For CORS requests, validate origin
  if (origin) {
    const isAllowedOrigin = allowedOrigins.some(
      (allowed) => origin === allowed || origin.startsWith(allowed),
    );

    if (!isAllowedOrigin) {
      return NextResponse.json(
        {
          error: "Access denied",
          message: "This API is not accessible from your origin",
        },
        { status: 403 },
      );
    }
  }

  // For same-origin requests, validate referer
  if (referer && !origin) {
    const refererUrl = new URL(referer);
    const isAllowedReferer = allowedOrigins.some((allowed) => {
      try {
        const allowedUrl = new URL(allowed);
        return refererUrl.hostname === allowedUrl.hostname;
      } catch {
        return false;
      }
    });

    if (!isAllowedReferer && refererUrl.hostname !== host) {
      return NextResponse.json(
        {
          error: "Access denied",
          message: "Invalid referer",
        },
        { status: 403 },
      );
    }
  }

  // If no origin and no referer, block (except for localhost in dev)
  if (!origin && !referer) {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        {
          error: "Access denied",
          message: "Missing origin or referer header",
        },
        { status: 403 },
      );
    }
  }

  return null; // Access allowed
}

/**
 * Adds CORS headers to the response
 */
export function addCorsHeaders(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  const origin = request.headers.get("origin");

  const allowedOrigins = [
    "https://calendar-eight-beige.vercel.app",
    process.env.NEXT_PUBLIC_APP_URL,
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ].filter(Boolean) as string[];

  if (
    origin &&
    allowedOrigins.some(
      (allowed) => origin === allowed || origin.startsWith(allowed),
    )
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

/**
 * Validates Vercel Cron requests using Authorization Bearer token
 * Vercel cron automatically adds the Authorization header when configured in vercel.json
 */
export function validateCronAccess(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // In development, allow without secret
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  // Check if CRON_SECRET is configured
  if (!cronSecret) {
    console.error("CRON_SECRET is not configured in environment variables");
    return NextResponse.json(
      {
        error: "Server configuration error",
        message: "Cron secret is not configured",
      },
      { status: 500 },
    );
  }

  // Validate Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Missing or invalid authorization header",
      },
      { status: 401 },
    );
  }

  const token = authHeader.replace("Bearer ", "");

  if (token !== cronSecret) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid cron secret",
      },
      { status: 401 },
    );
  }

  return null; // Access allowed
}

/**
 * Checks if a path is a cron endpoint
 */
export function isCronEndpoint(pathname: string): boolean {
  const cronPaths = ["/api/cron/", "/api/ping-db"];

  return cronPaths.some((path) => pathname.startsWith(path));
}
