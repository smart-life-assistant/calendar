import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Get user profile
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: {
        username: session.user.username,
        deleted: false,
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, username } = body;

    // Validate input
    if (!full_name?.trim() || !username?.trim()) {
      return NextResponse.json(
        { error: "Full name and username are required" },
        { status: 400 }
      );
    }

    // Check if new username already exists (if username is being changed)
    if (username !== session.user.username) {
      const existingUser = await prisma.users.findUnique({
        where: {
          username: username,
          deleted: false,
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: {
        username: session.user.username,
        deleted: false,
      },
      data: {
        full_name: full_name.trim(),
        username: username.trim(),
        updated_at: new Date(),
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        updated_at: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
