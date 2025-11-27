import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Query nhẹ nhất: SELECT 1
    const result = await prisma.$queryRaw`SELECT NOW()`;

    return NextResponse.json({
      ok: true,
      time: result,
    });
  } catch (error) {
    const e = error as Error;
    console.error("Database ping failed:", e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
