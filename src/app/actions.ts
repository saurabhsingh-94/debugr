"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getAuthUser() {
  const session = await auth();
  return session?.user;
}

export async function isUsernameAvailable(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });
    return !user;
  } catch {
    return false;
  }
}

export async function syncUser() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return await (prisma.user as any).upsert({
    where: { id: user.id },
    update: {
      email: user.email!,
      avatarUrl: (user as any).avatarUrl || user.image,
    },
    create: {
      id: user.id,
      email: user.email!,
      name: user.name || user.email?.split("@")[0] || "Anonymous",
      avatarUrl: (user as any).avatarUrl || user.image,
      username:
        (user.name || user.email?.split("@")[0])
          ?.toLowerCase()
          .replace(/\s+/g, "_") +
        "_" +
        Math.floor(Math.random() * 1000),
    },
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
    },
  });
}

export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("Please sign in to update your profile");

    const data = {
      name: formData.get("name") as string,
      username: (formData.get("username") as string)?.toLowerCase(),
      bio: formData.get("bio") as string,
      location: formData.get("location") as string,
      website: formData.get("website") as string,
      githubProfile: formData.get("githubProfile") as string,
      xProfile: formData.get("xProfile") as string,
      instagramProfile: formData.get("instagramProfile") as string,
      avatarUrl: formData.get("avatarUrl") as string,
    };

    await (prisma.user as any).update({
      where: { id: user.id },
      data,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function postPost(content: string) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  await (prisma.post as any).create({
    data: {
      content,
      authorId: user.id,
    },
  });

  revalidatePath("/");
}

export async function postPrompt(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("You must be signed in to list a prompt.");

    const title = (formData.get("title") as string)?.trim();
    const previewContent = (formData.get("previewContent") as string)?.trim() || "";
    const fullContent = (formData.get("fullContent") as string)?.trim();
    const priceRaw = formData.get("price") as string;
    const category = (formData.get("category") as string)?.trim() || "general";
    const aiModel = (formData.get("aiModel") as string)?.trim() || "GPT-4";
    const currency = (formData.get("currency") as string)?.trim() || "INR";
    const thumbnailRaw = (formData.get("thumbnailUrl") as string)?.trim();
    // Store null if empty to avoid DB constraint errors on the URL field
    const thumbnailUrl = thumbnailRaw && thumbnailRaw.length > 0 ? thumbnailRaw : null;

    if (!title) throw new Error("Title is required.");
    if (!fullContent) throw new Error("Prompt content is required.");

    const price = parseFloat(priceRaw);
    if (isNaN(price) || price < 0) throw new Error("A valid price is required.");

    await prisma.prompt.create({
      data: {
        title,
        description: previewContent || null,
        previewContent,
        fullContent,
        price,
        category: category.toLowerCase(),
        aiModel,
        currency,
        thumbnailUrl,
        authorId: user.id,
      },
    });

    revalidatePath("/marketplace");
  } catch (error: any) {
    // Re-throw with a clean message so the client toast can display it
    throw new Error(error.message || "Failed to create listing. Please try again.");
  }
}

export async function toggleLike(targetId: string, type: "post" | "prompt") {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const existingLike = await (prisma.like as any).findUnique({
    where: {
      userId_postId:
        type === "post" ? { userId: user.id, postId: targetId } : undefined,
      userId_promptId:
        type === "prompt" ? { userId: user.id, promptId: targetId } : undefined,
    },
  });

  if (existingLike) {
    await (prisma.like as any).delete({ where: { id: existingLike.id } });
  } else {
    await (prisma.like as any).create({
      data: {
        userId: user.id,
        [type === "post" ? "postId" : "promptId"]: targetId,
      },
    });

    try {
      let receiverId: string | undefined;
      if (type === "post") {
        const post = await (prisma.post as any).findUnique({
          where: { id: targetId },
          select: { authorId: true },
        });
        receiverId = post?.authorId;
      } else {
        const prompt = await (prisma.prompt as any).findUnique({
          where: { id: targetId },
          select: { authorId: true },
        });
        receiverId = prompt?.authorId;
      }

      if (receiverId && receiverId !== user.id) {
        await (prisma.notification as any).create({
          data: {
            type: "LIKE",
            userId: receiverId,
            actorId: user.id,
            postId: type === "post" ? targetId : null,
            promptId: type === "prompt" ? targetId : null,
          },
        });
      }
    } catch (e) {
      console.error("Notification failed", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/marketplace");
}

export async function toggleBookmark(targetId: string, type: "post" | "prompt") {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const existing = await (prisma.bookmark as any).findUnique({
    where: {
      userId_postId:
        type === "post" ? { userId: user.id, postId: targetId } : undefined,
      userId_promptId:
        type === "prompt" ? { userId: user.id, promptId: targetId } : undefined,
    },
  });

  if (existing) {
    await (prisma.bookmark as any).delete({ where: { id: existing.id } });
  } else {
    await (prisma.bookmark as any).create({
      data: {
        userId: user.id,
        [type === "post" ? "postId" : "promptId"]: targetId,
      },
    });
  }
  revalidatePath("/");
}

export async function toggleFollow(followingId: string) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");
  if (user.id === followingId) return;

  const existing = await (prisma.follow as any).findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId,
      },
    },
  });

  if (existing) {
    await (prisma.follow as any).delete({ where: { id: existing.id } });
  } else {
    await (prisma.follow as any).create({
      data: {
        followerId: user.id,
        followingId,
      },
    });

    await (prisma.notification as any).create({
      data: {
        type: "FOLLOW",
        userId: followingId,
        actorId: user.id,
      },
    });
  }
  revalidatePath("/profile");
}

export async function addComment(
  targetId: string,
  type: "post" | "prompt",
  content: string
) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  await (prisma.comment as any).create({
    data: {
      content,
      userId: user.id,
      [type === "post" ? "postId" : "promptId"]: targetId,
    },
  });

  try {
    let receiverId: string | undefined;
    if (type === "post") {
      const post = await (prisma.post as any).findUnique({
        where: { id: targetId },
        select: { authorId: true },
      });
      receiverId = post?.authorId;
    } else {
      const prompt = await (prisma.prompt as any).findUnique({
        where: { id: targetId },
        select: { authorId: true },
      });
      receiverId = prompt?.authorId;
    }

    if (receiverId && receiverId !== user.id) {
      await (prisma.notification as any).create({
        data: {
          type: "COMMENT",
          userId: receiverId,
          actorId: user.id,
          postId: type === "post" ? targetId : null,
          promptId: type === "prompt" ? targetId : null,
        },
      });
    }
  } catch (e) {}

  revalidatePath("/");
}

export async function getNotifications() {
  const user = await getAuthUser();
  if (!user?.id) return [];

  return await (prisma.notification as any).findMany({
    where: { userId: user.id },
    include: {
      actor: {
        select: { name: true, image: true, avatarUrl: true, username: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationsAsRead() {
  const user = await getAuthUser();
  if (!user?.id) return;

  await (prisma.notification as any).updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });
}
