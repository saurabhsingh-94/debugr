"use client";

import { TrendingUp, CheckCircle2, Trophy, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function RightPanel() {
  return (
    <aside className="w-80 hidden xl:flex flex-col gap-6 fixed right-0 top-16 bottom-0 p-8 border-l border-white/5 bg-background/50 overflow-y-auto">
      
      {/* TOP SIGNALS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white italic">Top Signals Today</h3>
          <TrendingUp className="w-3 h-3 text-accent" />
        </div>
        <div className="space-y-3">
          {[
            { title: "Recursive Agent Loops", votes: "842 Upvotes", growth: "+12%" },
            { title: "Zero-Shot Sentiment Analysis", votes: "611 Upvotes", growth: "+8%" },
            { title: "Local Llama-3 Finetuning", votes: "429 Upvotes", status: "hot" },
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors truncate pr-2">
                  {item.title}
                </p>
                {item.growth && <span className="text-[9px] font-mono text-accent">{item.growth}</span>}
                {item.status && <span className="text-[9px] font-mono text-orange-400 uppercase tracking-tighter italic">hot</span>}
              </div>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter">{item.votes}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-[1px] bg-white/5" />

      {/* RECENTLY SOLVED */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white italic">Recently Solved</h3>
          <CheckCircle2 className="w-3 h-3 text-secondary" />
        </div>
        <div className="space-y-3">
          {[
            { title: "JSON Formatter Hallucination", user: "@prompt_wizard" },
            { title: "Rate Limit Backoff Helper", user: "@dev_ops_king" },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-panel border border-white/5 rounded-lg group hover:border-secondary/30 transition-all">
              <p className="text-[11px] font-bold text-white mb-2">{item.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-500 uppercase">Solved by</span>
                <span className="text-[9px] font-mono text-secondary">{item.user}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-[1px] bg-white/5" />

      {/* ACTIVE BOUNTIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white italic">Active Bounties</h3>
          <Coins className="w-3 h-3 text-accent" />
        </div>
        <div className="space-y-2">
          {[
            { title: "Stable Diff Video Flow", reward: "2.5 ETH", ends: "4h" },
            { title: "RAG Latency Patch", reward: "500 USDC", ends: "2d" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
              <div>
                <p className="text-[10px] font-bold text-white truncate w-24">{item.title}</p>
                <p className="text-[8px] font-mono text-gray-500 uppercase mt-1">Ends in {item.ends}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-accent tracking-tight">{item.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto pt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter mb-1">Active Signals</p>
          <p className="text-xl font-black text-white tracking-tighter">12.4k</p>
        </div>
        <div>
          <p className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter mb-1">Total Solves</p>
          <p className="text-xl font-black text-white tracking-tighter text-right">892</p>
        </div>
      </div>
    </aside>
  );
}
