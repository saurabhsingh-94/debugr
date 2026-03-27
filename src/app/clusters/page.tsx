"use client";

import { motion } from "framer-motion";
import { Layers, HardDrive, Cpu, Cloud, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const CLUSTERS = [
  { id: "Alpha Core", nodes: 128, load: "84%", status: "OPTIMAL", type: "Processing Core" },
  { id: "Beta Hub", nodes: 64, load: "32%", status: "IDLE", type: "Edge Network" },
  { id: "Gamma Node", nodes: 256, load: "91%", status: "OVERLOAD", type: "Deep Learning" },
  { id: "Delta Lab", nodes: 12, load: "0%", status: "OFFLINE", type: "Sandbox" },
];

export default function ClustersPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-zinc-400" />
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Infrastructure</h1>
        </div>
        <p className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase">Distributed neural compute resources and cloud infrastructure</p>
      </div>

      {/* Cluster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CLUSTERS.map((cluster, i) => (
          <motion.div 
            key={cluster.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-white/[0.01] rounded-[32px] border border-white/10 backdrop-blur-md group-hover:bg-white/[0.03] group-hover:border-white/20 transition-all" />
            <div className="relative p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center border",
                  cluster.status === "OPTIMAL" ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" :
                  cluster.status === "OVERLOAD" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                  "bg-zinc-500/10 border-zinc-500/20 text-zinc-600"
                )}>
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                   <h3 className="text-sm font-black text-white italic tracking-wider uppercase">{cluster.id}</h3>
                   <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase mt-1">{cluster.type}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
                    <span className="text-zinc-700">Nodes</span>
                    <span className="text-white">{cluster.nodes}</span>
                 </div>
                 <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
                    <span className="text-zinc-700">Load</span>
                    <span className="text-white">{cluster.load}</span>
                 </div>
                 <span className={cn(
                   "text-[8px] font-black tracking-widest px-2 py-1 rounded border mt-2",
                   cluster.status === "OPTIMAL" ? "border-cyan-500/20 text-cyan-400" :
                   cluster.status === "OVERLOAD" ? "border-red-500/20 text-red-500" :
                   "border-white/10 text-zinc-600"
                 )}>{cluster.status}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
