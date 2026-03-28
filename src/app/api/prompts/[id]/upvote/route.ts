import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const promptId = params.id;

  try {
    const existing = await prisma.like.findUnique({
      where: { userId_promptId: { userId, promptId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      const count = await prisma.like.count({ where: { promptId } });
      return NextResponse.json({ upvoted: false, count });
    } else {
      await prisma.like.create({ data: { userId, promptId } });
      const count = await prisma.like.count({ where: { promptId } });
      return NextResponse.json({ upvoted: true, count });
    }
  } catch {
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id;
  const promptId = params.id;

  const [count, userLike] = await Promise.all([
    prisma.like.count({ where: { promptId } }),
    userId ? prisma.like.findUnique({ where: { userId_promptId: { userId, promptId } } }) : null,
  ]);

  return NextResponse.json({ count, upvoted: !!userLike });
}
