"use client";

import { TrendingUp, CheckCircle2, Trophy, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function RightPanel() {
  return (
    <aside className="w-80 hidden xl:flex flex-col gap-8 fixed right-0 top-24 bottom-0 p-8 pt-0 overflow-y-auto">
      
      {/* TOP SIGNALS */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">TRENDING_HOT</h3>
          <TrendingUp className="w-3.5 h-3.5 text-white/40" />
        </div>
        <div className="space-y-6">
          {[
            { title: "RECURSIVE_AGENT_LOOPS", votes: "842 U_VOTES", growth: "+12%" },
            { title: "ZERO_SHOT_SENTIMENT", votes: "611 U_VOTES", growth: "+8%" },
            { title: "LOCAL_LLAMA_3_F_TUNE", votes: "429 U_VOTES", status: "HOT" },
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex justify-between items-start mb-1.5">
                <p className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors truncate pr-2 tracking-tight">
                  {item.title}
                </p>
                {item.growth && <span className="text-[8px] font-mono text-zinc-600 font-bold">{item.growth}</span>}
                {item.status && <div className="p-1 rounded bg-white/10 ring-1 ring-white/10"><span className="text-[7px] font-bold text-white uppercase tracking-tighter block leading-none">HOT</span></div>}
              </div>
              <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white/10 w-2/3 group-hover:bg-white/20 transition-all" />
              </div>
              <p className="text-[8px] font-bold font-mono text-zinc-700 uppercase tracking-widest mt-2">{item.votes}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-white/5 mx-2" />

      {/* RECENTLY SOLVED */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">COMPLETED</h3>
          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
        </div>
        <div className="space-y-4">
          {[
            { title: "JSON FORMATTER HALLUCINATION", user: "@PROMPT_WIZ" },
            { title: "RATE LIMIT BACKOFF HELPER", user: "@DEV_OPS_K" },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 ring-1 ring-white/5 transition-all">
              <p className="text-[10px] font-bold text-white/90 mb-3 tracking-tight leading-relaxed">{item.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">SOLVER</span>
                <span className="text-[9px] font-mono text-zinc-500 font-bold">{item.user}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-white/5 mx-2" />

      {/* ACTIVE BOUNTIES */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">ACTIVE_BOUNTY</h3>
          <Coins className="w-3.5 h-3.5 text-white/80" />
        </div>
        <div className="space-y-3">
          {[
            { title: "STABLE DIFF VIDEO FLOW", reward: "2.5 ETH", ends: "4H" },
            { title: "RAG LATENCY PATCH", reward: "500 USDC", ends: "2D" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10 ring-1 ring-white/5 group hover:ring-white/20 transition-all">
              <div>
                <p className="text-[10px] font-bold text-white/90 truncate w-24 tracking-tight">{item.title}</p>
                <p className="text-[8px] font-bold font-mono text-zinc-700 uppercase mt-1">TIME_L: {item.ends}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white tracking-tighter">{item.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto pt-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
          <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mb-2">SIGNALS</p>
          <p className="text-xl font-bold text-white/90 tracking-tighter">12.4k</p>
        </div>
        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
          <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mb-2">SOLVES</p>
          <p className="text-xl font-bold text-white/90 tracking-tighter text-right">892</p>
        </div>
      </div>
    </aside>
  );
}
