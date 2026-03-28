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

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
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
      expertise: true,
      isProfessional: true,
      professionalStatus: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
          prompts: true,
        },
      },
    },
  });
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
      isAdmin: user.email === "rsaurabhsingh84@gmail.com",
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
      isAdmin: true,
      location: true,
      website: true,
      githubProfile: true,
      xProfile: true,
      instagramProfile: true,
      isProfessional: true,
      professionalStatus: true,
      bankName: true,
      accountNumber: true,
      ifscCode: true,
      accountHolderName: true,
      expertise: true,
      profileVisits: true,
      createdAt: true,
    },
  });
}

export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("Please sign in to update your profile");

    const data: any = {
      name: formData.get("name") as string,
      username: (formData.get("username") as string)?.toLowerCase(),
      bio: formData.get("bio") as string,
      location: formData.get("location") as string,
      website: formData.get("website") as string,
      githubProfile: formData.get("githubProfile") as string,
      xProfile: formData.get("xProfile") as string,
      instagramProfile: formData.get("instagramProfile") as string,
      gender: formData.get("gender") as string,
      isPrivate: formData.get("isPrivate") === "true",
      expertise: formData.get("expertise") as string,
    };

    const avatarUrl = formData.get("avatarUrl");
    if (avatarUrl === "REMOVE") {
      data.avatarUrl = null;
    } else if (avatarUrl) {
      data.avatarUrl = avatarUrl as string;
    }

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

export async function switchToProfessional() {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("Unauthorized");

    await prisma.user.update({
      where: { id: user.id },
      data: { isProfessional: true, professionalStatus: "UNCONFIGURED" },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function verifyBankAccount(accountNumber: string, ifsc: string, name: string) {
  try {
    const response = await fetch("https://api.cashfree.com/verification/bank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
      },
      body: JSON.stringify({
        beneficiary_account: accountNumber,
        beneficiary_ifsc: ifsc,
        beneficiary_name: name,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Cashfree Verification Error:", error);
    return null;
  }
}

export async function updateBankDetails(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("Unauthorized");

    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const ifscCode = formData.get("ifscCode") as string;
    const accountHolderName = formData.get("accountHolderName") as string;

    // Trigger Automated "1 Rupee Test"
    const verification = await verifyBankAccount(accountNumber, ifscCode, accountHolderName);
    
    let status = "PENDING";
    let isProfessional = false;

    if (verification?.status === "SUCCESS") {
      const bankNameFromRecord = verification.data?.accountHolderName?.toLowerCase();
      const providedName = accountHolderName.toLowerCase();
      
      const bankWords = bankNameFromRecord.split(/\s+/);
      const userWords = providedName.split(/\s+/);
      const matchEntries = userWords.filter(word => bankWords.includes(word));
      
      if (matchEntries.length >= 2 || bankNameFromRecord === providedName) {
        status = "VERIFIED";
        isProfessional = true;
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        bankName,
        accountNumber,
        ifscCode,
        accountHolderName,
        professionalStatus: status,
        isProfessional: isProfessional,
      },
    });

    revalidatePath("/dashboard/creator");
    return { 
      success: true, 
      verified: status === "VERIFIED",
      message: status === "VERIFIED" ? "Identity instantly synchronized." : "Verification pending administrative review."
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function recordProfileVisit(username: string) {
  try {
    await prisma.user.update({
      where: { username },
      data: { profileVisits: { increment: 1 } },
    });
    return { success: true };
  } catch (e) {
    return { error: "Failed to record visit" };
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

export async function getPendingVerifications() {
  const sessionUser = await getAuthUser();
  if (!sessionUser?.id) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user?.isAdmin) throw new Error("Unauthorized");

  return await prisma.user.findMany({
    where: { professionalStatus: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveUser(userId: string) {
  const sessionUser = await getAuthUser();
  if (!sessionUser?.id) throw new Error("Unauthorized");

  const admin = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!admin?.isAdmin) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: { 
      professionalStatus: "VERIFIED",
      isProfessional: true 
    },
  });

  revalidatePath("/admin/verification");
  revalidatePath("/dashboard/creator");
  return { success: true };
}

export async function rejectUser(userId: string) {
  const sessionUser = await getAuthUser();
  if (!sessionUser?.id) throw new Error("Unauthorized");

  const admin = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!admin?.isAdmin) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: { 
      professionalStatus: "UNCONFIGURED",
      isProfessional: false 
    },
  });

  revalidatePath("/admin/verification");
  revalidatePath("/dashboard/creator");
  return { success: true };
}

/**
 * SIGNAL ACTIONS
 */

export async function postSignal(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("You must be signed in to post a signal.");

    const type = formData.get("type") as string;
    const origin = formData.get("origin") as string;
    const priority = formData.get("priority") as string;
    const strength = formData.get("strength") as string;

    if (!type || !origin) throw new Error("Type and Origin are required.");

    await prisma.signal.create({
      data: {
        type,
        origin,
        priority: priority || "INFO",
        strength: strength || "0%",
        authorId: user.id,
      },
    });

    console.log("✅ Signal posted successfully by:", user.id);
    revalidatePath("/signals");
    return { success: true };
  } catch (error: any) {
    console.error("❌ postSignal error:", error);
    throw new Error(error.message || "Failed to post signal");
  }
}

export async function submitProblem(formData: FormData) {
  return await postSignal(formData);
}

/**
 * BOUNTY ACTIONS
 */

export async function postBounty(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("You must be signed in to create a mission.");

    const task = formData.get("task") as string;
    const reward = formData.get("reward") as string;
    const difficulty = formData.get("difficulty") as string;
    const expiresAtRaw = formData.get("expiresAt") as string;

    if (!task || !reward) throw new Error("Task and Reward are required.");

    await prisma.bounty.create({
      data: {
        task,
        reward,
        difficulty: difficulty || "EASY",
        expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        userId: user.id,
      },
    });

    revalidatePath("/bounties");
    return { success: true };
  } catch (error: any) {
    console.error("postBounty error:", error);
    throw new Error(error.message || "Failed to create mission");
  }
}

/**
 * INTEL ASSET ACTIONS (Exchange)
 */

export async function postIntelAsset(formData: FormData) {
  try {
    const user = await getAuthUser();
    if (!user?.id) throw new Error("You must be signed in to list an asset.");

    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    if (!title || !price) throw new Error("Title and Price are required.");

    await prisma.intelAsset.create({
      data: {
        title,
        price,
        category: category || "general",
        description: description || "",
        userId: user.id,
      },
    });

    revalidatePath("/exchange");
    return { success: true };
  } catch (error: any) {
    console.error("postIntelAsset error:", error);
    throw new Error(error.message || "Failed to list asset");
  }
}

/**
 * MARKETPLACE ACTIONS
 */

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

    console.log("✅ Prompt listed successfully by:", user.id);
    revalidatePath("/marketplace");
    return { success: true };
  } catch (error: any) {
    console.error("❌ postPrompt error:", error);
    throw new Error(error.message || "Failed to create listing. Please try again.");
  }
}

/**
 * SOCIAL & NOTIFICATION ACTIONS
 */

export async function toggleLike(targetId: string, type: "post" | "prompt", reactionType: string = "LIKE") {
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
    if (existingLike.type === reactionType) {
      await (prisma.like as any).delete({ where: { id: existingLike.id } });
    } else {
      await (prisma.like as any).update({
        where: { id: existingLike.id },
        data: { type: reactionType },
      });
    }
  } else {
    await (prisma.like as any).create({
      data: {
        userId: user.id,
        type: reactionType,
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
            message: `reacted ${reactionType} to your ${type}`,
          },
        });
      }
    } catch (e) {}
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

export async function toggleRepost(postId: string) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  const existing = await (prisma as any).repost.findUnique({
    where: { userId_postId: { userId: user.id, postId } },
  });

  if (existing) {
    await (prisma as any).repost.delete({ where: { id: existing.id } });
  } else {
    await (prisma as any).repost.create({
      data: { userId: user.id, postId },
    });

    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      });
      if (post?.authorId && post.authorId !== user.id) {
        await (prisma.notification as any).create({
          data: {
            type: "REPOST",
            userId: post.authorId,
            actorId: user.id,
            postId,
          },
        });
      }
    } catch (e) {}
  }
  revalidatePath("/");
  revalidatePath("/profile");
}

export async function getBookmarkedPosts() {
  const user = await getAuthUser();
  if (!user?.id) return [];

  const bookmarks = await (prisma as any).bookmark.findMany({
    where: { userId: user.id, postId: { not: null } },
    include: {
      post: {
        include: {
          author: {
            select: { id: true, name: true, username: true, avatarUrl: true, image: true, isProfessional: true },
          },
          _count: { select: { likes: true, comments: true, reposts: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookmarks.map((b: any) => ({
    ...b.post,
    user: b.post.author,
    likeCount: b.post._count.likes,
    commentCount: b.post._count.comments,
    repostCount: b.post._count.reposts,
    isBookmarked: true,
  }));
}

export async function getPostWithComments(postId: string) {
  const user = await getAuthUser();
  
  const post = await (prisma.post as any).findUnique({
    where: { id: postId },
    include: {
      author: {
        select: { id: true, name: true, username: true, avatarUrl: true, image: true, isProfessional: true },
      },
      comments: {
        where: { parentId: null },
        include: {
          user: {
            select: { id: true, name: true, username: true, avatarUrl: true, image: true },
          },
          replies: {
            include: {
              user: {
                select: { id: true, name: true, username: true, avatarUrl: true, image: true },
              },
            }
          }
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { likes: true, comments: true, reposts: true } },
    },
  });

  if (!post) return null;

  let isLiked = false;
  let isBookmarked = false;
  let isReposted = false;

  if (user?.id) {
    const [like, bookmark, repost] = await Promise.all([
      (prisma.like as any).findUnique({ where: { userId_postId: { userId: user.id, postId } } }),
      (prisma.bookmark as any).findUnique({ where: { userId_postId: { userId: user.id, postId } } }),
      (prisma as any).repost.findUnique({ where: { userId_postId: { userId: user.id, postId } } }),
    ]);
    isLiked = !!like;
    isBookmarked = !!bookmark;
    isReposted = !!repost;
  }

  return {
    ...post,
    user: post.author,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    repostCount: post._count.reposts,
    isLiked,
    isBookmarked,
    isReposted,
  };
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
  content: string,
  parentId?: string
) {
  const user = await getAuthUser();
  if (!user?.id) throw new Error("Unauthorized");

  await (prisma.comment as any).create({
    data: {
      content,
      userId: user.id,
      parentId: parentId || null,
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
  if (type === "post") revalidatePath(`/post/${targetId}`);
}

/**
 * SEARCH ACTIONS
 */

export async function searchEverything(query: string) {
  try {
    const [users, prompts, posts] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
            { bio: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          image: true,
          bio: true,
          isProfessional: true,
          professionalStatus: true,
        },
        take: 8,
      }),
      prisma.prompt.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { previewContent: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
            { aiModel: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          author: {
            select: { name: true, username: true, avatarUrl: true },
          },
        },
        take: 12,
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.findMany({
        where: {
          content: { contains: query, mode: "insensitive" },
        },
        include: {
          author: {
            select: { name: true, username: true, avatarUrl: true },
          },
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return { users, prompts, posts };
  } catch (error) {
    console.error("searchEverything error:", error);
    return { users: [], prompts: [], posts: [] };
  }
}

/**
 * NOTIFICATION VIEW ACTIONS
 */

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

export async function getPersonalStats() {
  const user = await getAuthUser();
  if (!user?.id) return null;

  const [prompts, purchases, signals, bounties] = await Promise.all([
    prisma.prompt.count({ where: { authorId: user.id } }),
    prisma.purchase.count({ where: { userId: user.id } }),
    prisma.signal.count({ where: { authorId: user.id } }),
    prisma.bounty.count({ where: { userId: user.id } }),
  ]);

  return { prompts, purchases, signals, bounties };
}

export async function getPlatformStats() {
  const [users, prompts, totalEarnings] = await Promise.all([
    prisma.user.count(),
    prisma.prompt.count(),
    prisma.creatorEarning.aggregate({
      _sum: { amount: true },
    }),
  ]);

  return { users, prompts, totalEarnings: totalEarnings._sum.amount || 0 };
}

export async function getCreatorStats() {
  const user = await getAuthUser();
  if (!user?.id) return null;

  const [wallet, followers, profileVisitsResult] = await Promise.all([
    (prisma as any).wallet.findUnique({
      where: { userId: user.id },
      select: {
        pendingBalance:   true,
        availableBalance: true,
        totalEarned:      true,
      },
    }),
    prisma.follow.count({ where: { followingId: user.id } }),
    (prisma as any).user.findUnique({
      where: { id: user.id },
      select: { profileVisits: true },
    }),
  ]);

  return {
    pendingBalance:   wallet ? Number(wallet.pendingBalance)   : 0,
    availableBalance: wallet ? Number(wallet.availableBalance) : 0,
    totalEarned:      wallet ? Number(wallet.totalEarned)      : 0,
    totalEarnings:    wallet ? Number(wallet.totalEarned)      : 0,
    followers,
    profileVisits: profileVisitsResult?.profileVisits || 0,
  };
}

export async function getWalletTransactions(limit = 20) {
  const user = await getAuthUser();
  if (!user?.id) return [];

  const txns = await (prisma as any).walletTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id:          true,
      amount:      true,
      platformFee: true,
      type:        true,
      status:      true,
      source:      true,
      orderId:     true,
      promptId:    true,
      releaseAt:   true,
      createdAt:   true,
    },
  });

  return txns.map((t: any) => ({
    ...t,
    amount:      Number(t.amount),
    platformFee: Number(t.platformFee),
  }));
}
