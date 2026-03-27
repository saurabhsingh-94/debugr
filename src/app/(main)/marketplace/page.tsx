import { prisma } from "@/lib/db";
import MarketplaceClient from "@/components/MarketplaceClient";

export default async function MarketplacePage() {
  const prompts = await prisma.prompt.findMany({
    include: {
      creator: {
        select: {
          name: true,
          username: true,
          avatarUrl: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return <MarketplaceClient initialPrompts={prompts} />;
}
