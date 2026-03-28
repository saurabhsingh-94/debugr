import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = params.id;

  if (!session?.user?.id || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prompts = await prisma.prompt.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: { select: { likes: true, purchases: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(prompts);
  } catch (err) {
    console.error("User prompts fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}
