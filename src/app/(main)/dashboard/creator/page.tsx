import { getAuthUser, getCreatorStats, syncUser } from "@/app/actions";
import { redirect } from "next/navigation";
import CreatorDashboard from "@/components/CreatorDashboard";

export default async function CreatorDashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  // Sync user to get latest professional fields
  const user = await syncUser();
  if (!user) redirect("/login");

  const stats = await getCreatorStats();

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12">
      <CreatorDashboard user={user} stats={stats} />
    </div>
  );
}
