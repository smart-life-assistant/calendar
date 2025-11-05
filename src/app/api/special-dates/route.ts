import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const specialDates = await prisma.special_dates.findMany({
      where: {
        deleted: false,
      },
      orderBy: [{ month: "asc" }, { day: "asc" }],
    });

    return NextResponse.json(specialDates);
  } catch (error) {
    console.error("Error fetching special dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch special dates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const specialDate = await prisma.special_dates.create({
      data: {
        name: body.name,
        description: body.description,
        date_type: body.date_type,
        day: body.day,
        month: body.month,
        year: body.year,
        is_holiday: body.is_holiday || false,
        is_recurring: body.is_recurring || true,
      },
    });

    return NextResponse.json(specialDate);
  } catch (error) {
    console.error("Error creating special date:", error);
    return NextResponse.json(
      { error: "Failed to create special date" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const specialDate = await prisma.special_dates.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        date_type: data.date_type,
        day: data.day,
        month: data.month,
        year: data.year,
        is_holiday: data.is_holiday,
        is_recurring: data.is_recurring,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(specialDate);
  } catch (error) {
    console.error("Error updating special date:", error);
    return NextResponse.json(
      { error: "Failed to update special date" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Soft delete
    await prisma.special_dates.update({
      where: { id },
      data: {
        deleted: true,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting special date:", error);
    return NextResponse.json(
      { error: "Failed to delete special date" },
      { status: 500 }
    );
  }
}
