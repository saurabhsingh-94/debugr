import { getPendingVerifications } from "@/app/actions";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminVerificationClient from "@/components/AdminVerificationClient";

export default async function AdminVerificationPage() {
  const session = await auth();
  if (!session?.user || !(session.user as any).isAdmin) {
    redirect("/");
  }

  const pendingUsers = await getPendingVerifications();

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12">
      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_12px_rgba(124,58,237,0.6)] animate-pulse" />
          <h1 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em]">Protocol::Admin_Console</h1>
        </div>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Verification <span className="text-zinc-800">Queue</span>
        </h2>
        <p className="text-sm text-zinc-500 font-medium italic">
          Reviewing {pendingUsers.length} manual entry exceptions in the synchronization pipeline.
        </p>
      </div>

      <AdminVerificationClient initialUsers={pendingUsers} />
    </div>
  );
}
