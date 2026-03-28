import { prisma } from "@/lib/db";
import MarketplaceClient from "@/components/MarketplaceClient";
import { auth } from "@/auth";

// Always fetch fresh data — purchase status must be current
export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const prompts = await prisma.prompt.findMany({
    include: {
      author: {
        select: {
          name: true,
          username: true,
          avatarUrl: true,
        }
      },
      purchases: userId ? {
        where: { userId }
      } : false
    },
    orderBy: { createdAt: 'desc' },
  });

  const user = userId ? await prisma.user.findUnique({
    where: { id: userId },
    select: { isProfessional: true, professionalStatus: true }
  }) : null;

  // Security: strip fullContent, only expose it as 'content' if owned/purchased
  const sanitizedPrompts = prompts.map(p => {
    const isOwner = userId === p.authorId;
    const isPurchased = (p as any).purchases?.length > 0;
    const isUnlocked = isOwner || isPurchased;

    // Destructure to explicitly exclude fullContent from the spread
    const { fullContent, purchases, ...safePrompt } = p as any;

    return {
      ...safePrompt,
      content: isUnlocked ? fullContent : (p.previewContent || p.description),
      initialLocked: !isUnlocked,
    };
  });

  return <MarketplaceClient initialPrompts={sanitizedPrompts} user={user} />;
}
