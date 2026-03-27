"use client";

import { useState, useTransition } from "react";
import { approveUser, rejectUser } from "@/app/actions";
import toast from "react-hot-toast";
import { 
  CheckCircle2, XCircle, Landmark, 
  User, Mail, ArrowRight, Loader2,
  ShieldCheck, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminVerificationClientProps {
  initialUsers: any[];
}

export default function AdminVerificationClient({ initialUsers }: AdminVerificationClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      try {
        const res = action === 'approve' ? await approveUser(userId) : await rejectUser(userId);
        if (res.success) {
          toast.success(action === 'approve' ? "Creator Verified" : "Application Rejected");
          setUsers(users.filter(u => u.id !== userId));
        } else {
          toast.error("Process failed.");
        }
      } catch (err) {
        toast.error("System error.");
      }
    });
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 bg-white/[0.01] border border-dashed border-white/5 rounded-[48px]">
        <div className="w-20 h-20 rounded-full bg-emerald-500/5 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500/20" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black italic uppercase tracking-tighter text-white">Queue_Clear</p>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">Intelligence Synchronization Complete.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <AnimatePresence mode="popLayout">
        {users.map((user) => (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            key={user.id} 
            className="nn-card p-10 group relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-8 flex-1">
               <div className="relative">
                  <div className="w-20 h-20 rounded-[32px] overflow-hidden border border-white/10 ring-4 ring-white/5">
                     <img 
                       src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                       alt="Avatar" 
                       className="w-full h-full object-cover"
                     />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-amber-500 rounded-2xl shadow-xl">
                     <AlertCircle className="w-4 h-4 text-white" />
                  </div>
               </div>
               
               <div className="space-y-2 text-center lg:text-left">
                  <p className="text-2xl font-black italic uppercase tracking-tighter text-white">{user.name || "Anonymous Cluster"}</p>
                  <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                     <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{user.email}</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                        <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic leading-relaxed whitespace-nowrap">Manual Review Required</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* BANK DETAILS */}
            <div className="flex-1 w-full lg:w-auto p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
               <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <Landmark className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Bank_Terminal</p>
                    <p className="text-sm font-black text-white uppercase italic tracking-tighter">{user.bankName}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Account_ID</p>
                    <p className="text-xs font-bold text-white uppercase">{user.accountNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Network_IFSC</p>
                    <p className="text-xs font-bold text-white uppercase">{user.ifscCode}</p>
                  </div>
               </div>

               <div className="pt-2 border-t border-white/5">
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Holder_Identity</p>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{user.accountHolderName}</p>
               </div>
            </div>

            {/* ACTIONS */}
            <div className="flex lg:flex-col gap-4 w-full lg:w-60">
               <button 
                 onClick={() => handleAction(user.id, 'approve')}
                 disabled={isPending}
                 className="flex-1 lg:w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.95] flex items-center justify-center gap-3 group border-b-6 border-zinc-300"
               >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <ShieldCheck className="w-5 h-5 group-hover:scale-125 transition-transform" /> 
                      Grant Access
                    </>
                  )}
               </button>
               <button 
                 onClick={() => handleAction(user.id, 'reject')}
                 disabled={isPending}
                 className="flex-1 lg:w-full py-5 bg-white/[0.02] border border-white/5 text-zinc-600 text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all active:scale-[0.95] flex items-center justify-center gap-3"
               >
                  <XCircle className="w-5 h-5" /> Reject
               </button>
            </div>

            {/* DECORATIVE GLOW */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[80px] -z-10" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
