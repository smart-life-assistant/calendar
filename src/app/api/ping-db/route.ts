import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Query nhẹ nhất: SELECT 1
    const result = await prisma.special_dates.findFirst({
      select: {
        name: true,
      },
    });

    console.log("Database ping successful.");

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    const e = error as Error;
    console.error("Database ping failed:", e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
