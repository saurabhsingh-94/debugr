"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, ShieldCheck, Clock, ArrowRight, Plus, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { postBounty } from "../actions";

const INITIAL_BOUNTIES = [
  { id: "BNT_104", task: "Debug Cluster-C Latency", reward: "$5,000", difficulty: "HARD", expires: "14h 22m" },
  { id: "BNT_209", task: "Reverse Engineer SIG_0x89", reward: "$12,500", difficulty: "INSANE", expires: "2d 4h" },
];

export default function BountiesPage() {
  const [showPost, setShowPost] = useState(false);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-zinc-400" />
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">ACTIVE_BOUNTIES</h1>
          </div>
          <p className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase">High-priority AI system optimization and debugging tasks</p>
        </div>
        <button 
          onClick={() => setShowPost(true)}
          className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> CREATE_BOUNTY
        </button>
      </div>

      {/* Bounty List */}
      <div className="space-y-4">
        {INITIAL_BOUNTIES.map((bounty, i) => (
          <motion.div 
            key={bounty.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-white/[0.02] rounded-[32px] border border-white/5 backdrop-blur-md group-hover:bg-white/[0.04] group-hover:border-white/20 transition-all shadow-xl" />
            <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-8">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border",
                    bounty.difficulty === "HARD" ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                    bounty.difficulty === "INSANE" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                    "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  )}>
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-black text-white italic tracking-tight uppercase group-hover:text-cyan-400 transition-colors">{bounty.task}</h3>
                    <div className="flex items-center gap-4 mt-2">
                       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{bounty.id}</span>
                       <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-zinc-700" />
                          <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{bounty.expires}</span>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                  <div className="flex flex-col items-end">
                     <span className="text-lg font-black text-white tracking-tighter italic">{bounty.reward}</span>
                     <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Authorized_Grant</span>
                  </div>
                  <button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2 group/btn">
                     Accept
                     <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {showPost && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPost(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg relative bg-[#0A0A0A] border border-white/10 rounded-[40px] p-10"
            >
              <button 
                onClick={() => setShowPost(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Create Bounty</h2>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Authorize a high-priority system task</p>
                </div>

                <form action={async (formData) => {
                  await postBounty(formData);
                  setShowPost(false);
                }} className="space-y-6">
                  <div className="space-y-4">
                    <input name="task" placeholder="MISSION_OBJECTIVE" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white" required />
                    <input name="reward" placeholder="REWARD_AMOUNT (e.g. $10,000)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white" required />
                    <select name="difficulty" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <option value="EASY">EASY_DIFFICULTY</option>
                      <option value="HARD">HARD_DIFFICULTY</option>
                      <option value="INSANE">INSANE_DIFFICULTY</option>
                    </select>
                    <input type="datetime-local" name="expiresAt" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400" required />
                  </div>

                  <button type="submit" className="w-full py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                    AUTHORIZE_MISSION <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
