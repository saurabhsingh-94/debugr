"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function submitProblem(formData: FormData) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

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
  if (!user) throw new Error("Unauthorized");

  // Ensure user exists in Prisma
  await (prisma.user as any).upsert({
    where: { id: user.id },
    update: { 
      email: user.email!,
      avatarUrl: (user.user_metadata.avatar_url as string) || (user.user_metadata.picture as string) || null
    },
    create: { 
      id: user.id, 
      email: user.email!,
      name: (user.user_metadata.full_name as string) || (user.user_metadata.name as string) || (user.email?.split('@')[0] as string),
      avatarUrl: (user.user_metadata.avatar_url as string) || (user.user_metadata.picture as string) || null
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const avatarUrl = user.user_metadata.avatar_url || user.user_metadata.picture || null;
  const name = user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0] || "Anonymous";

  return await (prisma.user as any).upsert({
    where: { id: user.id },
    update: { 
      email: user.email!,
      avatarUrl: avatarUrl,
    },
    create: { 
      id: user.id, 
      email: user.email!,
      name: name,
      avatarUrl: avatarUrl,
    },
  });
}

export async function updateUserProfile(formData: FormData) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;
  const githubProfile = formData.get("githubProfile") as string;
  const xProfile = formData.get("xProfile") as string;
  const instagramProfile = formData.get("instagramProfile") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  await (prisma.user as any).update({
    where: { id: user.id },
    data: { 
      name, 
      username, 
      bio, 
      githubProfile, 
      xProfile, 
      instagramProfile,
      avatarUrl 
    },
  });

  revalidatePath("/profile");
  revalidatePath("/settings");
}
export async function postSignal(formData: FormData) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

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
  if (!user) throw new Error("Unauthorized");

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
  if (!user) throw new Error("Unauthorized");

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
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const price = formData.get("price") ? Number(formData.get("price")) : null;
  const thumbnailUrl = formData.get("thumbnailUrl") as string; // Will be handled by a mock or future upload

  await (prisma as any).prompt.create({
    data: {
      title,
      description,
      content,
      category,
      price,
      thumbnailUrl,
      authorId: user.id,
    },
  });

  revalidatePath("/marketplace");
  revalidatePath("/profile");
}
