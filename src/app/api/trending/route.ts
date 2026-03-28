import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Extract hashtags from text
function extractHashtags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  return matches.map((h) => h.toLowerCase());
}

export async function GET() {
  try {
    // Get recent posts (last 7 days) to extract trending hashtags
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [recentPosts, topCategories, topModels] = await Promise.all([
      prisma.post.findMany({
        where: { createdAt: { gte: since } },
        select: { content: true },
        take: 500,
        orderBy: { createdAt: "desc" },
      }),
      // Top prompt categories as trending topics
      prisma.prompt.groupBy({
        by: ["category"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
        where: { category: { not: null } },
      }),
      // Top AI models as trending topics
      prisma.prompt.groupBy({
        by: ["aiModel"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 4,
        where: { aiModel: { not: null } },
      }),
    ]);

    // Count hashtag frequency from posts
    const hashtagCount: Record<string, number> = {};
    for (const post of recentPosts) {
      const tags = extractHashtags(post.content);
      for (const tag of tags) {
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
      }
    }

    // Sort by frequency
    const trendingFromPosts = Object.entries(hashtagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count, type: "hashtag" as const }));

    // Add category-based trending topics
    const categoryTrends = topCategories
      .filter((c) => c.category)
      .map((c) => ({
        tag: `#${c.category!.replace(/\s+/g, "")}`,
        count: c._count.id,
        type: "category" as const,
      }));

    // Add AI model trends
    const modelTrends = topModels
      .filter((m) => m.aiModel)
      .map((m) => ({
        tag: `#${m.aiModel!.replace(/[\s.-]+/g, "")}`,
        count: m._count.id,
        type: "model" as const,
      }));

    // Merge and deduplicate, sort by count
    const allTrends = [...trendingFromPosts, ...categoryTrends, ...modelTrends]
      .reduce((acc, item) => {
        const existing = acc.find((t) => t.tag === item.tag);
        if (existing) {
          existing.count += item.count;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, [] as { tag: string; count: number; type: string }[])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // If not enough real data, pad with static defaults
    const defaults = [
      { tag: "#GPT4", count: 0, type: "model" },
      { tag: "#AIPrompts", count: 0, type: "hashtag" },
      { tag: "#Claude", count: 0, type: "model" },
      { tag: "#CodeGen", count: 0, type: "category" },
      { tag: "#Midjourney", count: 0, type: "model" },
      { tag: "#Marketing", count: 0, type: "category" },
      { tag: "#Writing", count: 0, type: "category" },
      { tag: "#Debugging", count: 0, type: "hashtag" },
    ];

    const finalTrends =
      allTrends.length >= 5
        ? allTrends
        : [
            ...allTrends,
            ...defaults.filter(
              (d) => !allTrends.find((t) => t.tag === d.tag)
            ),
          ].slice(0, 10);

    return NextResponse.json({ trending: finalTrends });
  } catch (err) {
    console.error("Trending API error:", err);
    return NextResponse.json({ trending: [] }, { status: 500 });
  }
}
