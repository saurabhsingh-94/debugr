import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const voteSchema = z.object({
  problemId: z.string(),
  userId: z.string(),
  painScore: z.number().min(1).max(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { problemId, userId, painScore } = voteSchema.parse(body);

    const vote = await prisma.vote.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
      update: {
        painScore,
      },
      create: {
        userId,
        problemId,
        painScore,
      },
    });

    return NextResponse.json(vote);
  } catch (error) {
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 400 });
  }
}
