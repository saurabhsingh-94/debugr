"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getAuthUser() {
  const session = await auth();
  return session?.user;
}

export async function submitProblem(formData: FormData) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tags = (formData.get("tags") as string).split(",").map(t => t.trim());

  await prisma.problem.create({
    data: {
      title,
      description,
      tags,
    },
  });

  revalidatePath("/");
}

export async function castVote(problemId: string, painScore: number) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  // Ensure user exists in Prisma
  await prisma.user.upsert({
    where: { id: user.id },
    update: { 
      email: user.email!,
      avatarUrl: user.image
    },
    create: { 
      id: user.id, 
      email: user.email!,
      name: user.name || user.email?.split('@')[0],
      username: (user.name || user.email?.split('@')[0])?.toLowerCase().replace(/\s+/g, '_'),
      avatarUrl: user.image
    },
  });

  await prisma.vote.upsert({
    where: { userId_problemId: { userId: user.id, problemId } },
    update: { painScore },
    create: { userId: user.id, problemId, painScore },
  });

  revalidatePath("/");
}

export async function syncUser() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return await (prisma.user as any).upsert({
    where: { id: user.id },
    update: { 
      email: user.email!,
      avatarUrl: user.image,
    },
    create: { 
      id: user.id, 
      email: user.email!,
      name: user.name || user.email?.split('@')[0] || "Anonymous",
      avatarUrl: user.image,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      image: true,
      avatarUrl: true,
      location: true,
      website: true,
      githubProfile: true,
      xProfile: true,
      instagramProfile: true,
      createdAt: true,
    }
  });
}

export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("Please sign in to update your profile");

    const updateData: any = {};
    
    // Only add to update object if field exists in formData
    const fields = [
      "name", "username", "bio", "githubProfile", 
      "xProfile", "instagramProfile", "avatarUrl",
      "location", "website"
    ];

    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        updateData[field] = value as string;
      }
    });

    console.log(`[Identity] Syncing profile for user ${user.id}:`, updateData);

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    revalidatePath("/profile");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (err: any) {
    // toast.error("Action failed. Please try again."); // This line is commented out as 'toast' is not defined in this server action context.
    // Server actions should throw errors that can be caught and handled on the client.
    console.error("Update failed:", err);
    throw new Error(err.message || "Failed to update profile");
  }
}

export async function getPersonalStats() {
  const user = await getAuthUser();
  if (!user?.id) return null;

  const [signals, bounties, prompts, assets, purchases] = await Promise.all([
    prisma.signal.count({ where: { userId: user.id } }),
    prisma.bounty.count({ where: { userId: user.id } }),
    prisma.prompt.count({ where: { creatorId: user.id } }),
    prisma.intelAsset.count({ where: { userId: user.id } }),
    prisma.purchase.count({ where: { userId: user.id } }),
  ]);

  return { signals, bounties, prompts, assets, purchases };
}

export async function getPlatformStats() {
  const [users, prompts, signals, earnings] = await Promise.all([
    prisma.user.count(),
    prisma.prompt.count(),
    prisma.signal.count(),
    prisma.creatorEarning.aggregate({ _sum: { amount: true } }),
  ]);

  return { users, prompts, signals, totalEarnings: earnings._sum.amount || 0 };
}

export async function searchEverything(query: string) {
  if (!query || query.length < 2) return { users: [], prompts: [] };

  const isHashtag = query.startsWith("#");
  const searchTerm = isHashtag ? query.slice(1) : query;

  const [users, prompts] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { username: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      select: { id: true, name: true, username: true, avatarUrl: true, bio: true },
      take: 10
    }),
    prisma.prompt.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: { creator: { select: { name: true, username: true, avatarUrl: true } } },
      take: 10
    })
  ]);

  return { users, prompts };
}
export async function postSignal(formData: FormData) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const type = formData.get("type") as string;
  const origin = formData.get("origin") as string;
  const priority = formData.get("priority") as string;
  const strength = formData.get("strength") as string;

  await prisma.signal.create({
    data: {
      type,
      origin,
      priority,
      strength,
      userId: user.id,
    },
  });

  revalidatePath("/signals");
  revalidatePath("/dashboard");
}

export async function postBounty(formData: FormData) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const task = formData.get("task") as string;
  const reward = formData.get("reward") as string;
  const difficulty = formData.get("difficulty") as string;
  const expiresAt = new Date(formData.get("expiresAt") as string);

  await prisma.bounty.create({
    data: {
      task,
      reward,
      difficulty,
      expiresAt,
      userId: user.id,
    },
  });

  revalidatePath("/bounties");
}

export async function postIntelAsset(formData: FormData) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  await prisma.intelAsset.create({
    data: {
      title,
      price,
      category,
      description,
      userId: user.id,
    },
  });

  revalidatePath("/exchange");
}
export async function postPrompt(formData: FormData) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const previewContent = formData.get("previewContent") as string;
  const fullContent = formData.get("fullContent") as string;
  const category = (formData.get("category") as string) || "general";
  const aiModel = (formData.get("aiModel") as string) || "GPT-4";
  const currency = (formData.get("currency") as string) || "INR";
  const price = formData.get("price") ? Number(formData.get("price")) : 0;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;

  await prisma.prompt.create({
    data: {
      title,
      description,
      previewContent: previewContent || description.slice(0, 100),
      fullContent: fullContent || previewContent || description,
      content: fullContent || previewContent || description, // Legacy support
      category,
      aiModel,
      currency,
      price,
      thumbnailUrl,
      creatorId: user.id,
    },
  });

  revalidatePath("/marketplace");
  revalidatePath("/profile");
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      avatarUrl: true,
      location: true,
      website: true,
      githubProfile: true,
      xProfile: true,
      instagramProfile: true,
      createdAt: true,
    }
  });
}

export async function isUsernameAvailable(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true }
  });
  return !user;
}
export async function postPost(content: string) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/profile");
}

export async function toggleLike(targetId: string, type: 'post' | 'prompt') {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const where = type === 'post' 
    ? { userId_postId: { userId: user.id, postId: targetId } }
    : { userId_promptId: { userId: user.id, promptId: targetId } };

  const existing = await prisma.like.findUnique({ where: where as any });

  if (existing) {
    await prisma.like.delete({ where: where as any });
  } else {
    await prisma.like.create({
      data: {
        userId: user.id,
        [type === 'post' ? 'postId' : 'promptId']: targetId
      }
    });
  }

  revalidatePath("/");
  revalidatePath("/marketplace");
}

export async function toggleBookmark(targetId: string, type: 'post' | 'prompt') {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const where = type === 'post' 
    ? { userId_postId: { userId: user.id, postId: targetId } }
    : { userId_promptId: { userId: user.id, promptId: targetId } };

  const existing = await prisma.bookmark.findUnique({ where: where as any });

  if (existing) {
    await prisma.bookmark.delete({ where: where as any });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        [type === 'post' ? 'postId' : 'promptId']: targetId
      }
    });
  }

  revalidatePath("/");
  revalidatePath("/marketplace");
}

export async function toggleFollow(followingId: string) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");
  if (user.id === followingId) return;

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId
      }
    }
  });

  if (existing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId
        }
      }
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId
      }
    });
  }

  revalidatePath("/profile");
  revalidatePath("/explore");
}

export async function addComment(targetId: string, type: 'post' | 'prompt', content: string) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      [type === 'post' ? 'postId' : 'promptId']: targetId
    }
  });

  revalidatePath("/");
  revalidatePath("/marketplace");
}
