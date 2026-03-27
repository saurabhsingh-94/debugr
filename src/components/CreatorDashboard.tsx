"use client";

import { useState, useTransition } from "react";
import { 
  TrendingUp, Users, Eye, IndianRupee, 
  CreditCard, ShieldCheck, Clock, CheckCircle2,
  AlertCircle, ArrowRight, Loader2, Landmark, Zap
} from "lucide-react";
import { switchToProfessional, updateBankDetails } from "@/app/actions";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CreatorDashboardProps {
  user: any;
  stats: any;
}

export default function CreatorDashboard({ user, stats }: CreatorDashboardProps) {
  const [isPending, startTransition] = useTransition();

  if (!user.isProfessional) {
    return <JoinCreatorView isPending={isPending} startTransition={startTransition} />;
  }

  return (
    <div className="space-y-10 font-grotesk">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
             <h1 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em]">Network::Creator_Hub</h1>
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Creator <span className="text-zinc-800">Intelligence</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
           <div className={cn(
             "w-12 h-12 rounded-2xl flex items-center justify-center",
             user.professionalStatus === "VERIFIED" ? "bg-emerald-500/10" : "bg-amber-500/10"
           )}>
              {user.professionalStatus === "VERIFIED" ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <Clock className="w-6 h-6 text-amber-400" />
              )}
           </div>
           <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Status_Check</p>
              <p className={cn(
                "text-sm font-black uppercase italic",
                user.professionalStatus === "VERIFIED" ? "text-emerald-400" : "text-amber-400"
              )}>{user.professionalStatus}</p>
           </div>
        </div>
      </div>

      {/* MAIN_STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<IndianRupee className="w-5 h-5 text-emerald-400" />} 
          label="Total_Earnings" 
          value={`₹${stats?.totalEarnings?.toLocaleString() || 0}`} 
          sub="Net Revenue"
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-violet-400" />} 
          label="Followers" 
          value={stats?.followers || 0} 
          sub="Audience Size"
        />
        <StatCard 
          icon={<Eye className="w-5 h-5 text-cyan-400" />} 
          label="Profile_Visits" 
          value={stats?.profileVisits || 0} 
          sub="Network Reach"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* BANK DETAILS OR VERIFICATION INFO */}
         <div className="space-y-6">
            <h3 className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.4em] italic px-2">Operational_Financials</h3>
            
            {user.professionalStatus === "UNCONFIGURED" ? (
              <BankDetailsForm isPending={isPending} startTransition={startTransition} />
            ) : (
              <div className="nn-card p-10 space-y-8 bg-zinc-900/50">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-white/[0.03] border border-white/10 flex items-center justify-center">
                       <Landmark className="w-8 h-8 text-zinc-600" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-white uppercase tracking-widest">{user.bankName || "Unknown Bank"}</p>
                       <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-[0.2em] mt-1">XXXX-{user.accountNumber?.slice(-4) || "0000"}</p>
                    </div>
                 </div>

                 <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Holder_Identity</p>
                       <p className="text-[10px] font-bold text-white uppercase">{user.accountHolderName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Network_IFSC</p>
                       <p className="text-[10px] font-bold text-white uppercase">{user.ifscCode}</p>
                    </div>
                 </div>

                 {user.professionalStatus === "PENDING" && (
                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                       <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                       <p className="text-[11px] font-medium text-amber-200/60 leading-relaxed italic">
                          Your verification is currently under review by our administrative protocol. Please allow 24-48 hours for intelligence synchronization.
                       </p>
                    </div>
                 )}

                 {user.professionalStatus === "VERIFIED" && (
                    <button 
                      className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 border-b-4 border-zinc-300"
                      onClick={() => toast.success("Payout request submitted to administrative queue.")}
                    >
                       Request Payout
                    </button>
                 )}
              </div>
            )}
         </div>

         {/* TIPS & ANNOUNCEMENTS */}
         <div className="space-y-6">
            <h3 className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.4em] italic px-2">Creator_Intelligence</h3>
            <div className="nn-card p-10 space-y-10">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">Protocol_v2.1</p>
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Maximize your reach in the <span className="text-zinc-700">Neural Marketplace</span></h4>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed italic">
                     Professional accounts now receive 85% of each prompt sale. Ensure your prompts are detailed and categorized correctly to appear in the global feed.
                  </p>
               </div>

               <div className="nn-divider opacity-10" />

               <div className="space-y-6">
                  <Tip icon={<TrendingUp className="w-4 h-4" />} text="Verified creators get 2x visibility in marketplace searches." />
                  <Tip icon={<Zap className="w-4 h-4" />} text="Add social handles to build cross-platform authority." />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="nn-card p-8 group hover:border-violet-500/20 transition-all border-b-4 border-white/5 hover:border-b-violet-500/40">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-white/[0.03] rounded-2xl group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-black italic tracking-tighter text-white">{value}</p>
        <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.2em] pt-4">{sub}</p>
      </div>
    </div>
  );
}

function Tip({ icon, text }: any) {
   return (
      <div className="flex items-start gap-4">
         <div className="mt-1">{icon}</div>
         <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">{text}</p>
      </div>
   );
}

function JoinCreatorView({ isPending, startTransition }: any) {
   const handleJoin = () => {
      startTransition(async () => {
         const res = await switchToProfessional();
         if (res.success) {
            toast.success("Welcome to the Creator Program!");
         } else {
            toast.error(res.error || "System synchronization failed.");
         }
      });
   };

   return (
      <div className="min-h-[70vh] flex items-center justify-center font-grotesk p-6">
         <div className="max-w-2xl w-full text-center space-y-12">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  <span className="text-[9px] font-black text-violet-400 uppercase tracking-[0.3em]">Identity_Upgrade_Available</span>
               </div>
               <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">Unlock Professional <span className="text-zinc-800">Capabilities</span></h2>
               <p className="text-lg text-zinc-500 font-medium italic max-w-lg mx-auto leading-relaxed">
                  Join our elite creator ecosystem. Share your intelligence, build your audience, and monetize your professional prompts.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
               <Feature icon={<IndianRupee className="w-5 h-5" />} title="85% Revenue Share" desc="Premium payout structure for all sales." />
               <Feature icon={<ShieldCheck className="w-5 h-5" />} title="Verified Badge" desc="Global recognition of expertise." />
               <Feature icon={<TrendingUp className="w-5 h-5" />} title="Advanced Analytics" desc="Track reach and profile growth." />
            </div>

            <button 
               onClick={handleJoin}
               disabled={isPending}
               className="px-12 py-6 bg-white text-black text-[13px] font-black uppercase tracking-[0.5em] rounded-[48px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-3xl flex items-center justify-center gap-4 mx-auto group border-b-6 border-zinc-300"
            >
               {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (<>Begin Synchronization <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>)}
            </button>
         </div>
      </div>
   );
}

function Feature({ icon, title, desc }: any) {
   return (
      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
         <div className="w-10 h-10 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
            {icon}
         </div>
         <p className="text-[11px] font-black text-white uppercase tracking-widest">{title}</p>
         <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest leading-relaxed">{desc}</p>
      </div>
   );
}

function BankDetailsForm({ isPending, startTransition }: any) {
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      startTransition(async () => {
         const res = await updateBankDetails(formData);
         if (res.success) {
            toast.success("Administrative verification pending.");
         } else {
            toast.error(res.error || "System synchronization failed.");
         }
      });
   };

   return (
      <div className="nn-card p-10 bg-white/[0.01]">
         <div className="mb-10">
            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Payout <span className="text-zinc-700">Configuration</span></h4>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Input financial terminal details below.</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            <DashboardInput label="Bank_Name" name="bankName" placeholder="e.g. HDFC BANK" required />
            <div className="grid grid-cols-2 gap-6">
               <DashboardInput label="Account_Terminal" name="accountNumber" placeholder="XXXX XXXX XXXX" required />
               <DashboardInput label="Network_IFSC" name="ifscCode" placeholder="HDFC0001234" required />
            </div>
            <DashboardInput label="Holder_Identity" name="accountHolderName" placeholder="AS REGISTERED IN BANK" required />

            <button 
               type="submit"
               disabled={isPending}
               className="w-full py-5 bg-violet-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-violet-500 transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 border-b-4 border-violet-800"
            >
               {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><CheckCircle2 className="w-5 h-5" /> Submit for Verification</>)}
            </button>
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
               <AlertCircle className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
               <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.2em] leading-relaxed italic">
                  Verification follows the administrative protocol. Once submitted, details cannot be altered during the evaluation phase.
               </p>
            </div>
         </form>
      </div>
   );
}

function DashboardInput({ label, ...props }: any) {
   return (
      <div className="space-y-3">
         <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] px-2 italic">{label}</label>
         <input 
            {...props}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[12px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
         />
      </div>
   );
}
