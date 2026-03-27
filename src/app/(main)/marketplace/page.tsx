import { prisma } from "@/lib/db";
import MarketplaceClient from "@/components/MarketplaceClient";
import { auth } from "@/auth";

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

  // Security: Mask fullContent if not owned or purchased
  const sanitizedPrompts = prompts.map(p => {
    const isOwner = userId === p.authorId;
    const isPurchased = (p as any).purchases?.length > 0;
    const isUnlocked = isOwner || isPurchased;

    return {
      ...p,
      content: isUnlocked ? p.fullContent : p.previewContent,
      initialLocked: !isUnlocked
    };
  });

  return <MarketplaceClient initialPrompts={sanitizedPrompts} user={user} />;
}
