"use client";

import { TrendingUp, CheckCircle2, Trophy, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function RightPanel() {
  return (
    <aside className="w-80 hidden xl:flex flex-col gap-10 fixed right-0 top-24 bottom-0 p-8 pt-0 overflow-y-auto custom-scrollbar">
      
      {/* TOP SIGNALS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">TRENDING_HOT</h3>
          <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
        </div>
        <div className="space-y-8">
          {[
            { title: "RECURSIVE_AGENT_LOOPS", votes: "842 U_VOTES", growth: "+12%" },
            { title: "ZERO_SHOT_SENTIMENT", votes: "611 U_VOTES", growth: "+8%" },
            { title: "LOCAL_LLAMA_3_F_TUNE", votes: "429 U_VOTES", status: "HOT" },
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex justify-between items-start mb-2.5">
                <p className="text-[12px] font-bold text-zinc-400 group-hover:text-white transition-all duration-500 truncate pr-2 tracking-tight">
                  {item.title}
                </p>
                {item.growth && <span className="text-[8px] font-mono text-zinc-700 font-bold tracking-tighter">{item.growth}</span>}
                {item.status && <div className="px-1.5 py-0.5 rounded-md bg-white/10 ring-1 ring-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]"><span className="text-[7px] font-black text-white uppercase tracking-tighter block leading-none">HOT</span></div>}
              </div>
              <div className="w-full h-0.5 bg-white/[0.02] rounded-full overflow-hidden ring-1 ring-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "66%" }}
                  className="h-full bg-white/20 group-hover:bg-white/40 transition-all duration-700" 
                />
              </div>
              <p className="text-[8px] font-bold font-mono text-zinc-800 uppercase tracking-[0.2em] mt-3">{item.votes}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-white/5 mx-4" />

      {/* RECENTLY SOLVED */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">COMPLETED</h3>
          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
        </div>
        <div className="space-y-5">
          {[
            { title: "JSON FORMATTER HALLUCINATION", user: "@PROMPT_WIZ" },
            { title: "RATE LIMIT BACKOFF HELPER", user: "@DEV_OPS_K" },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl group hover:bg-white/[0.03] hover:border-white/10 ring-1 ring-white/5 transition-all duration-500 shadow-xl backdrop-blur-3xl">
              <p className="text-[11px] font-bold text-zinc-300 group-hover:text-white mb-4 tracking-tight leading-relaxed transition-colors">{item.title}</p>
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[8px] text-zinc-800 font-bold uppercase tracking-[0.2em]">SOLVER</span>
                <span className="text-[10px] font-mono text-zinc-600 font-bold tracking-tighter">{item.user}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-white/5 mx-4" />

      {/* ACTIVE BOUNTIES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">ACTIVE_BOUNTY</h3>
          <Coins className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        <div className="space-y-4">
          {[
            { title: "STABLE DIFF VIDEO FLOW", reward: "2.5 ETH", ends: "4H" },
            { title: "RAG LATENCY PATCH", reward: "500 USDC", ends: "2D" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 ring-1 ring-white/5 group hover:ring-white/20 transition-all duration-500 backdrop-blur-2xl shadow-lg">
              <div>
                <p className="text-[11px] font-bold text-zinc-200 truncate w-24 tracking-tight group-hover:text-white transition-colors">{item.title}</p>
                <p className="text-[8px] font-bold font-mono text-zinc-800 uppercase mt-1.5 tracking-widest">TIME_L: {item.ends}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-white/90 tracking-tighter group-hover:text-white transition-all">{item.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto pt-10 grid grid-cols-2 gap-4">
        <div className="p-5 bg-white/[0.01] rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-inner backdrop-blur-xl">
          <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-[0.3em] mb-2.5">SIGNALS</p>
          <p className="text-2xl font-black text-white/80 tracking-tighter">12.4k</p>
        </div>
        <div className="p-5 bg-white/[0.01] rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-inner backdrop-blur-xl text-right">
          <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-[0.3em] mb-2.5">SOLVES</p>
          <p className="text-2xl font-black text-white/80 tracking-tighter">892</p>
        </div>
      </div>
    </aside>
  );
}
