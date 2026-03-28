import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const cursor = searchParams.get("cursor");

  try {
    const posts = await prisma.post.findMany({
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            image: true,
            name: true,
            isProfessional: true,
            professionalStatus: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

    // Normalize: expose author as "user" so PostFeed doesn't need changes
    const normalized = posts.map((p) => ({
      ...p,
      user: p.author,
      likeCount: p._count.likes,
      commentCount: p._count.comments,
    }));

    return NextResponse.json({ posts: normalized, nextCursor });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (content.length > 500) {
    return NextResponse.json({ error: "Content too long (max 500)" }, { status: 400 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            image: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ ...post, user: post.author });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
