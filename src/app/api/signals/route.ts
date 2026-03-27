import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { votes: true }
        }
      }
    });

    const signals = problems.map(prob => ({
      id: prob.id,
      title: prob.title,
      description: prob.description,
      tags: prob.tags,
      votes: prob._count.votes,
      painScore: 5,
      mergedFrom: 0,
      commentCount: 0,
    }));

    return NextResponse.json(signals);
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 });
  }
}
