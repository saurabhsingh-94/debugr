"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function getAuthUser() {
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
      image: user.image
    },
    create: { 
      id: user.id, 
      email: user.email!,
      name: user.name || user.email?.split('@')[0],
      image: user.image
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
      image: user.image,
    },
    create: { 
      id: user.id, 
      email: user.email!,
      name: user.name || user.email?.split('@')[0] || "Anonymous",
      image: user.image,
    },
  });
}

export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("AUTH_REQUIRED: Identity not found");

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

    console.log(`[AUTH] Updating profile for user ${user.id}:`, updateData);

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    revalidatePath("/profile");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error: any) {
    console.error("[AUTH] Profile Update Failure:", error);
    throw new Error(error.message || "Failed to update profile");
  }
}
export async function postSignal(formData: FormData) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const type = formData.get("type") as string;
  const origin = formData.get("origin") as string;
  const priority = formData.get("priority") as string;
  const strength = formData.get("strength") as string;

  await (prisma as any).signal.create({
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

  await (prisma as any).bounty.create({
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

  await (prisma as any).intelAsset.create({
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
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const price = formData.get("price") ? Number(formData.get("price")) : null;
  const thumbnailUrl = formData.get("thumbnailUrl") as string; // Will be handled by a mock or future upload

  await prisma.prompt.create({
    data: {
      title,
      description,
      content,
      category: category || "general",
      price: price || 0,
      thumbnailUrl,
      creatorId: user.id, // Correct field name in schema
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
      githubProfile: true,
      xProfile: true,
      instagramProfile: true,
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
