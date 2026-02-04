import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Cron endpoint to keep database connection alive
 * Protected by CRON_SECRET in middleware
 * Called daily by Vercel Cron: 0 0 * * * (midnight UTC)
 */
export async function GET() {
  try {
    // Query nhẹ nhất: SELECT 1
    const result = await prisma.special_dates.findFirst({
      select: {
        name: true,
      },
    });

    console.log("Database ping successful at:", new Date().toISOString());

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: "Database connection is healthy",
    });
  } catch (error) {
    const e = error as Error;
    console.error("Database ping failed:", e.message);
    return NextResponse.json(
      {
        ok: false,
        error: e.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
