import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const signalRecords = await prisma.signal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, username: true, avatarUrl: true }
        }
      }
    });

    const signals = signalRecords.map(sig => ({
      id: sig.id,
      type: sig.type,
      origin: sig.origin,
      priority: sig.priority,
      strength: sig.strength,
      author: sig.author?.name || "Anonymous",
      createdAt: sig.createdAt
    }));

    return NextResponse.json(signals);
  } catch (error) {
    console.error("Database error in signals API:", error);
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 });
  }
}
