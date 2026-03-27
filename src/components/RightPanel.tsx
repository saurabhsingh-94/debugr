"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity, ArrowUpRight, Globe } from "lucide-react";

const TRENDING_TAGS = [
  { id: 1, tag: "#MainnetV1", growth: "+148%", momentum: "High" },
  { id: 2, tag: "#TrendIndex", growth: "+92%", momentum: "Medium" },
  { id: 3, tag: "#CorePulse", growth: "+45%", momentum: "Stable" },
];

export default function RightPanel() {
  return (
    <aside className="w-[380px] hidden xl:flex flex-col gap-6 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto scrollbar-none pb-12">
      {/* GLOBAL PULSE */}
      <div className="nn-card p-6 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Global Pulse</span>
        </div>
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Live • 1,284 nodes</span>
      </div>

      {/* TRENDING SIGNALS */}
      <div className="nn-card p-8 border border-white/5 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Trending Now</h3>
          <TrendingUp className="w-4 h-4 text-violet-500" />
        </div>
        
        <div className="space-y-6">
          {TRENDING_TAGS.map((tag) => (
            <div key={tag.id} className="group cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-black text-white italic uppercase tracking-tight group-hover:text-violet-400 transition-colors">
                  {tag.tag}
                </span>
                <span className="text-[10px] font-bold text-emerald-500">{tag.growth}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{tag.momentum} Momentum</span>
                <div className="flex-1 h-[1px] bg-white/[0.03]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-12 border-t border-white/[0.03] space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-[9px] text-zinc-800 font-bold uppercase tracking-[0.3em]">System Integrity</p>
          <div className="h-1 w-full bg-white/[0.02] rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "94%" }}
               transition={{ duration: 2, ease: "easeOut" }}
               className="h-full bg-white/20"
             />
          </div>
        </div>
        <p className="text-[8px] text-zinc-900 font-black uppercase tracking-[0.5em] text-center italic">Debugr v0.2.0</p>
      </div>

    </aside>
  );
}
