import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const problemSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  tags: z.array(z.string()).min(1),
  referenceId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, tags, referenceId } = problemSchema.parse(body);

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        tags,
        referenceId,
      },
    });

    return NextResponse.json(problem);
  } catch (error) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}

export async function GET() {
  const problems = await prisma.problem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { votes: true },
      },
    },
  });

  return NextResponse.json(problems);
}
