import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id, postId: { not: null } },
      include: {
        post: {
          include: {
            author: {
              select: { id: true, name: true, username: true, avatarUrl: true, image: true },
            },
            _count: { select: { likes: true, comments: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      bookmarks
        .filter((b) => b.post)
        .map((b) => ({
          ...b.post!,
          user: b.post!.author,
          likeCount: b.post!._count.likes,
          commentCount: b.post!._count.comments,
        }))
    );
  } catch (err) {
    console.error("Bookmarks fetch error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
