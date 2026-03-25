"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitProblem(formData: FormData) {
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

export async function castVote(problemId: string, userId: string, painScore: number) {
  await prisma.vote.upsert({
    where: { userId_problemId: { userId, problemId } },
    update: { painScore },
    create: { userId, problemId, painScore },
  });

  revalidatePath("/");
}
