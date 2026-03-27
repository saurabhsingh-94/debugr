import { prisma } from "@/lib/db";

/**
 * Recalculates priority scores for all clusters and saves history snapshots.
 * Formula: priorityScore = totalVotes * avgPainScore
 */
export async function runScoringWorker() {
  console.log("Starting scoring worker...");

  const clusters = await prisma.cluster.findMany({
    include: {
      problems: {
        include: {
          votes: true,
        },
      },
    },
  });

  const snapshots: any[] = [];

  for (const cluster of clusters) {
    let totalVotes = 0;
    let totalPain = 0;
    let voteCount = 0;

    for (const problem of cluster.problems) {
      totalVotes += problem.votes.length;
      voteCount += problem.votes.length;
      totalPain += problem.votes.reduce((acc, v) => acc + v.painScore, 0);
    }

    const avgPain = voteCount > 0 ? totalPain / voteCount : 0;
    const priorityScore = Math.round(totalVotes * avgPain);

    // Update cluster
    await prisma.cluster.update({
      where: { id: cluster.id },
      data: {
        priorityScore,
        problemCount: cluster.problems.length,
      },
    });

    snapshots.push({
      clusterId: cluster.id,
      score: priorityScore,
      recordedAt: new Date(),
    });
  }

  if (snapshots.length > 0) {
    await prisma.clusterScoreHistory.createMany({
      data: snapshots,
    });
  }

  console.log(`Scoring worker completed. Processed ${clusters.length} clusters.`);
}
