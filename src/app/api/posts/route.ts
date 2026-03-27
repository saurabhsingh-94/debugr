import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
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
            username: true,
            avatarUrl: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

    return NextResponse.json({ posts, nextCursor });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
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
    // Upsert on Auth Pattern: Ensure Prisma user exists
    // We check for username because it's required in the schema now.
    // NOTE: In production, we'd ensure the metadata has a username or redirect first.
    // For this flow, we assume the user has a username cached in metadata or DB.
    
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email!, // Keep email in sync
      },
      create: {
        id: user.id,
        email: user.email!,
        username: user.user_metadata?.username || `user_${user.id.slice(0, 8)}`, // Fallback for safety
        name: user.user_metadata?.full_name || user.email?.split("@")[0],
        avatarUrl: user.user_metadata?.avatar_url,
      },
    });

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: dbUser.id,
      },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
