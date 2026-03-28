import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = params.id;

  // Only allow fetching your own posts (or make public later)
  if (!session?.user?.id || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            image: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(
      posts.map((p) => ({
        ...p,
        user: p.author,
        likeCount: p._count.likes,
        commentCount: p._count.comments,
      }))
    );
  } catch (err) {
    console.error("User posts fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
