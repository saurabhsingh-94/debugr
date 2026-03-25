import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // Clean up
  await prisma.vote.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.cluster.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const user1 = await prisma.user.create({
    data: { email: "curator@zolvex.ai", password: "hashed_password" },
  });

  // Clusters
  const cluster1 = await prisma.cluster.create({
    data: { title: "LLM Context & Reasoning", priorityScore: 3500, problemCount: 12 },
  });

  const cluster2 = await prisma.cluster.create({
    data: { title: "Developer Tooling & Codegen", priorityScore: 7450, problemCount: 5 },
  });

  // Problems
  await prisma.problem.createMany({
    data: [
      {
        title: "GPT-4 Context Window 'Memory Leak'",
        description: "Degradation in output consistency after 32k tokens.",
        tags: ["AI", "LLM"],
        clusterId: cluster1.id,
      },
      {
        title: "Inconsistent Type Generation",
        description: "Codegen hallucinates nested interface structures.",
        tags: ["CODING", "TYPESCRIPT"],
        clusterId: cluster2.id,
      },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
