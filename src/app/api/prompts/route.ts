import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany({
      select: {
        id: true,
        title: true,
        previewContent: true,
        price: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(prompts);
  } catch (err) {
    console.error("GET /api/prompts error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, previewContent, fullContent, price } = await req.json();

    if (!title || !previewContent || !fullContent || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = await prisma.prompt.create({
      data: {
        title,
        previewContent,
        fullContent,
        price: parseFloat(price),
        authorId: session.user.id,
      },
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (err) {
    console.error("POST /api/prompts error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
