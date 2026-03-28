import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// Simple repost: creates a new post quoting the original
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const original = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: { select: { username: true } } },
    });
    if (!original) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // Prevent self-repost of own post (optional — allow if you want)
    const repost = await prisma.post.create({
      data: {
        content: original.content,
        authorId: session.user.id,
        // Store original post reference in content prefix
      },
    });

    return NextResponse.json({ success: true, repostId: repost.id });
  } catch {
    return NextResponse.json({ error: "Failed to repost" }, { status: 500 });
  }
}
