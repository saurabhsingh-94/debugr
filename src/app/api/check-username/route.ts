import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usernameInput = searchParams.get("username");

  if (!usernameInput) {
    return NextResponse.json({ available: false, error: "Username is required" }, { status: 400 });
  }

  // Normalize: lowercase, trim
  const username = usernameInput.toLowerCase().trim();

  // Validate: alphanumeric + underscore, length 3-20
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return NextResponse.json({ available: false, error: "Invalid username format" }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json({ available: false, error: "Database error" }, { status: 500 });
  }
}
