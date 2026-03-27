import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id;
  const promptId = params.id;

  try {
    // Zero-trust fetch: Only get fullContent if purchase exists
    const purchase = userId ? await prisma.purchase.findUnique({
      where: {
        userId_promptId: {
          userId,
          promptId
        }
      }
    }) : null;

    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        }
      }
    });

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    const { fullContent, ...previewPrompt } = prompt;

    // Return fullContent if purchased OR if the user IS the creator
    const canAccess = !!purchase || userId === prompt.authorId;

    return NextResponse.json({
      ...previewPrompt,
      fullContent: canAccess ? fullContent : null,
      hasAccess: canAccess,
    });
  } catch (err) {
    console.error("GET /api/prompts/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
