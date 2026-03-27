"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity, ArrowUpRight, Globe } from "lucide-react";

const trendData = [
  { id: 1, tag: "Protocol_Zero", growth: "+148%", momentum: "High" },
  { id: 2, tag: "Nexus_Drift", growth: "+92%", momentum: "Medium" },
  { id: 3, tag: "Ghost_Sync", growth: "+45%", momentum: "Stable" },
];

export default function RightPanel() {
  return (
    <div className="w-full h-full p-10 space-y-12 bg-transparent">
      
      {/* GLOBAL_HEARTBEAT */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">Global Heartbeat</h3>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
        </div>
        
        <div className="ghost-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Active nodes</p>
            <Globe className="w-3 h-3 text-zinc-800" />
          </div>
          <p className="text-3xl font-serif text-white tracking-tight italic">142,840</p>
          <div className="flex items-center gap-2 pt-2">
            <Activity className="w-3 h-3 text-zinc-800" />
            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Diagnostic Pulse Nominal</span>
          </div>
        </div>
      </div>

      {/* TRENDING_SIGNALS */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-1">High Momentum Signals</h3>
        <div className="space-y-3">
          {trendData.map((trend) => (
            <div key={trend.id} className="ghost-card p-5 group cursor-pointer flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors duration-500 uppercase tracking-widest">#{trend.tag}</p>
                <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.2em]">{trend.momentum} Momentum</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[11px] font-serif text-white italic">{trend.growth}</p>
                <TrendingUp className="w-3 h-3 text-emerald-500 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ATLAS_FOOTER */}
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
        <p className="text-[8px] text-zinc-900 font-black uppercase tracking-[0.5em] text-center italic">Debugr_v0.2.0-GHOST</p>
      </div>

    </div>
  );
}
