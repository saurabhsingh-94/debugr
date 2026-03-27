import { getAuthUser, getPersonalStats, getPlatformStats } from "@/app/actions";
import { redirect } from "next/navigation";
import { 
  Zap, ShoppingBag, Database, ArrowUpRight, 
  BarChart3, Users, IndianRupee, Globe
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const personalStats = await getPersonalStats();
  const globalStats = await getPlatformStats();

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12 space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_12px_rgba(124,58,237,0.6)] animate-pulse" />
             <h1 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em]">Dashboard::Control_Unit</h1>
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Operational <span className="text-zinc-800">Overview</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
           <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-violet-400" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Neural_Sync</p>
              <p className="text-sm font-black text-emerald-400 uppercase italic">Active_Session</p>
           </div>
        </div>
      </div>

      {/* STATS_GRID (PERSONAL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<ShoppingBag className="w-5 h-5 text-violet-400" />} 
          label="Market_Prompts" 
          value={personalStats?.prompts || 0} 
          sub="My Inventory"
        />
        <StatCard 
          icon={<Database className="w-5 h-5 text-emerald-400" />} 
          label="Intelligence_Revealed" 
          value={personalStats?.purchases || 0} 
          sub="Purchased_Intel"
        />
        <StatCard 
          icon={<Zap className="w-5 h-5 text-amber-400" />} 
          label="Social_Signals" 
          value={personalStats?.signals || 0} 
          sub="Engagement"
        />
        <StatCard 
          icon={<BarChart3 className="w-5 h-5 text-blue-400" />} 
          label="Active_Bounties" 
          value={personalStats?.bounties || 0} 
          sub="Solutions_Pending"
        />
      </div>

      {/* GLOBAL HUB SECTION */}
      <div className="space-y-8 pt-12 border-t border-white/5">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Globe className="w-5 h-5 text-zinc-600" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">Platform_Global_Metrics</h3>
            </div>
            <Link href="/explore" className="text-[9px] font-black uppercase tracking-widest text-violet-400 hover:text-white transition-colors flex items-center gap-2">
               Synchronize_Users <ArrowUpRight className="w-3 h-3" />
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlobalStat icon={<Users className="w-6 h-6" />} label="Total_Operators" value={globalStats.users} />
            <GlobalStat icon={<ShoppingBag className="w-6 h-6" />} label="Shared_Intelligence" value={globalStats.prompts} />
            <GlobalStat icon={<IndianRupee className="w-6 h-6" />} label="Platform_Circulation" value={globalStats.totalEarnings} isCurrency />
         </div>
      </div>

      {/* ACTION_FOOTER */}
      <div className="p-12 rounded-[48px] bg-white/[0.01] border border-white/5 text-center space-y-6">
         <p className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-800">Secure_Data_Sync_Complete</p>
         <div className="text-zinc-600 text-[10px] space-y-2">
            <p>All stats are synced in real-time with the Debugr Neural Network.</p>
            <p>Verification protocol: POSIX_B19273_SYNC</p>
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="nn-card p-8 group hover:border-violet-500/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-white/[0.03] rounded-2xl group-hover:bg-violet-500/10 transition-colors">
          {icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-zinc-800 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-black italic tracking-tighter text-white">{value}</p>
        <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.2em] pt-4">{sub}</p>
      </div>
    </div>
  );
}

function GlobalStat({ icon, label, value, isCurrency }: any) {
  return (
    <div className="flex flex-col gap-4">
       <div className="w-12 h-12 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center text-zinc-600">
          {icon}
       </div>
       <div className="space-y-1">
          <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-white italic tracking-tighter">
             {isCurrency ? `₹${value.toLocaleString()}` : value.toLocaleString()}
          </p>
       </div>
    </div>
  );
}
