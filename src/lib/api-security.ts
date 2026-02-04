import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// HELPER FUNCTIONS - Các hàm phụ trợ
// ============================================================================

/**
 * Lấy danh sách các origins được phép truy cập API
 * Bao gồm: production domain và localhost (khi development)
 */
function getAllowedOrigins(): string[] {
  return [
    "https://calendar-eight-beige.vercel.app",
    process.env.NEXT_PUBLIC_APP_URL,
    // Development only - cho phép localhost
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ].filter(Boolean) as string[];
}

/**
 * Kiểm tra xem user-agent có phải là automated tool không
 * Ví dụ: curl, wget, postman, python-requests, etc.
 *
 * Mục đích: Chặn các tools tự động crawl/scrape data
 * Lưu ý: Có thể fake được, nhưng chặn được 90% trường hợp
 */
function isAutomatedTool(userAgent: string): boolean {
  const suspiciousPatterns = [
    "curl",
    "wget",
    "python-requests",
    "postman",
    "insomnia",
    "httpie",
  ];

  return suspiciousPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern),
  );
}

/**
 * Kiểm tra xem có phải là direct browser access không
 * Ví dụ: User paste URL vào address bar và nhấn Enter
 *
 * Cách phát hiện:
 * - Không có Origin header (không phải CORS request)
 * - Không có Referer header (không click từ page nào)
 * - Accept header yêu cầu HTML (browser behavior)
 */
function isDirectBrowserAccess(
  origin: string | null,
  referer: string | null,
  accept: string,
): boolean {
  return !origin && !referer && accept.includes("text/html");
}

/**
 * Kiểm tra Origin header có hợp lệ không
 *
 * Origin header được browser tự động thêm vào CORS requests
 * Ví dụ: fetch() từ JavaScript sẽ có Origin header
 */
function isValidOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some(
    (allowed) => origin === allowed || origin.startsWith(allowed),
  );
}

/**
 * Kiểm tra Referer header có hợp lệ không
 *
 * Referer header cho biết request đến từ page nào
 * Ví dụ: Click link từ page A → Referer = URL của page A
 */
function isValidReferer(
  referer: string,
  host: string,
  allowedOrigins: string[],
): boolean {
  try {
    const refererUrl = new URL(referer);

    // Check xem referer hostname có match với allowed origins không
    const isAllowed = allowedOrigins.some((allowed) => {
      try {
        const allowedUrl = new URL(allowed);
        return refererUrl.hostname === allowedUrl.hostname;
      } catch {
        return false;
      }
    });

    // Cho phép nếu referer match hoặc cùng host
    return isAllowed || refererUrl.hostname === host;
  } catch {
    return false;
  }
}

// ============================================================================
// MAIN VALIDATION FUNCTION - Hàm validation chính
// ============================================================================

/**
 * Validates if the request is coming from an allowed origin
 *
 * Bảo vệ API khỏi:
 * 1. Direct browser access (paste URL vào browser)
 * 2. Automated tools (curl, wget, postman)
 * 3. Cross-origin attacks (requests từ domain khác)
 *
 * Lưu ý: Đây chỉ là lớp bảo vệ cơ bản
 * Đối với endpoints nhạy cảm, cần thêm authentication (session, JWT)
 */
export function validateApiAccess(request: NextRequest): NextResponse | null {
  // Lấy headers từ request
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  const userAgent = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";

  // Lấy danh sách origins được phép
  const allowedOrigins = getAllowedOrigins();

  // ======================================================
  // CHECK 1: Chặn automated tools (curl, wget, postman)
  // ======================================================
  if (isAutomatedTool(userAgent) && process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        error: "Access denied",
        message: "Automated access is not allowed",
      },
      { status: 403 },
    );
  }

  // ======================================================
  // CHECK 2: Chặn direct browser access
  // Ví dụ: Paste https://api.com/endpoint vào browser
  // ======================================================
  if (isDirectBrowserAccess(origin, referer, accept)) {
    return NextResponse.json(
      {
        error: "Direct API access is not allowed",
        message:
          "This API endpoint can only be accessed through the application",
      },
      { status: 403 },
    );
  }

  // ======================================================
  // CHECK 3: Validate Origin header (CORS requests)
  // Browser tự động thêm Origin khi gọi fetch() từ JS
  // ======================================================
  if (origin) {
    if (!isValidOrigin(origin, allowedOrigins)) {
      return NextResponse.json(
        {
          error: "Access denied",
          message: "This API is not accessible from your origin",
        },
        { status: 403 },
      );
    }
  }

  // ======================================================
  // CHECK 4: Validate Referer header (same-origin requests)
  // Khi không có Origin, check Referer để biết request từ đâu
  // ======================================================
  if (referer && !origin) {
    if (!isValidReferer(referer, host || "", allowedOrigins)) {
      return NextResponse.json(
        {
          error: "Access denied",
          message: "Invalid referer",
        },
        { status: 403 },
      );
    }
  }

  // ======================================================
  // CHECK 5: Chặn requests không có Origin và Referer
  // (Except development mode)
  // ======================================================
  if (!origin && !referer && process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        error: "Access denied",
        message: "Missing origin or referer header",
      },
      { status: 403 },
    );
  }

  // ✅ Tất cả checks pass → Cho phép truy cập
  return null;
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
 * Validates Vercel Cron requests using CRON_SECRET
 * Vercel automatically sends Authorization: Bearer ${CRON_SECRET} header
 * when CRON_SECRET environment variable is set
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
  // Vercel sends: Authorization: Bearer <CRON_SECRET>
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing authorization header",
      },
      { status: 401 },
    );
  }

  return null; // Access allowed
}
