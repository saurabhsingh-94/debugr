"use client";

import { TrendingUp, CheckCircle2, Trophy, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function RightPanel() {
  return (
    <aside className="w-80 hidden xl:flex flex-col gap-6 fixed right-0 top-16 bottom-0 p-8 border-l border-white/10 bg-background overflow-y-auto">
      
      {/* TOP SIGNALS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">TRENDING_SIGNAL</h3>
          <TrendingUp className="w-3 h-3 text-white" />
        </div>
        <div className="space-y-4">
          {[
            { title: "RECURSIVE_AGENT_LOOPS", votes: "842 U_VOTES", growth: "+12%" },
            { title: "ZERO_SHOT_SENTIMENT", votes: "611 U_VOTES", growth: "+8%" },
            { title: "LOCAL_LLAMA_3_F_TUNE", votes: "429 U_VOTES", status: "HOT" },
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors truncate pr-2">
                  {item.title}
                </p>
                {item.growth && <span className="text-[9px] font-mono text-zinc-500">{item.growth}</span>}
                {item.status && <span className="text-[9px] font-mono text-white uppercase tracking-tighter italic">HOT</span>}
              </div>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">{item.votes}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-[1px] bg-white/5" />

      {/* RECENTLY SOLVED */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">SOLVED_ITEMS</h3>
          <CheckCircle2 className="w-3 h-3 text-zinc-400" />
        </div>
        <div className="space-y-3">
          {[
            { title: "JSON FORMATTER HALLUCINATION", user: "@PROMPT_WIZ" },
            { title: "RATE LIMIT BACKOFF HELPER", user: "@DEV_OPS_K" },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-sm group hover:border-white/10 transition-all">
              <p className="text-[10px] font-bold text-white mb-3 tracking-tight">{item.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-zinc-600 uppercase">SOLVED_BY</span>
                <span className="text-[9px] font-mono text-zinc-400">{item.user}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-[1px] bg-white/5" />

      {/* ACTIVE BOUNTIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">ACTIVE_BOUNTY</h3>
          <Coins className="w-3 h-3 text-white" />
        </div>
        <div className="space-y-2">
          {[
            { title: "STABLE DIFF VIDEO FLOW", reward: "2.5 ETH", ends: "4H" },
            { title: "RAG LATENCY PATCH", reward: "500 USDC", ends: "2D" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-sm bg-white/5 border border-white/10">
              <div>
                <p className="text-[10px] font-bold text-white truncate w-24">{item.title}</p>
                <p className="text-[8px] font-mono text-zinc-600 uppercase mt-1">ENDS_IN {item.ends}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-white tracking-tight">{item.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto pt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter mb-1">ACTIVE_SIGNALS</p>
          <p className="text-xl font-bold text-white tracking-tighter">12.4k</p>
        </div>
        <div>
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter mb-1">TOTAL_SOLVES</p>
          <p className="text-xl font-bold text-white tracking-tighter text-right">892</p>
        </div>
      </div>
    </aside>
  );
}
