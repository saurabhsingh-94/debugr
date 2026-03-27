"use client";

import { motion } from "framer-motion";
import { Store, ShoppingCart, Tag, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const PROMPTS = [
  { id: "PRM_992", title: "Neural Debugger v4.1", price: "$49", rating: "4.9", category: "DIAGNOSTIC", auth: "VERIFIED" },
  { id: "PRM_084", title: "Cluster Optimiser XL", price: "$129", rating: "5.0", category: "PERFORMANCE", auth: "PRO" },
  { id: "PRM_121", title: "Signal Filter Pro", price: "$25", rating: "4.7", category: "BEHAVIORAL", auth: "VERIFIED" },
];

export default function PromptSellPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-zinc-400" />
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">TOOL_STORE</h1>
        </div>
        <p className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase">Premium AI diagnostic tools, prompts, and behavioral filters</p>
      </div>

      {/* Store Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROMPTS.map((tool, i) => (
          <motion.div 
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-white/[0.01] rounded-[40px] border border-white/5 backdrop-blur-[40px] group-hover:bg-white/[0.04] group-hover:border-white/20 transition-all shadow-2xl" />
            <div className="relative p-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-10">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[9px] font-black text-white">{tool.rating}</span>
                 </div>
                 <span className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">{tool.auth}</span>
              </div>

              <div className="space-y-4 mb-10">
                 <h3 className="text-lg font-black text-white uppercase italic tracking-tight leading-tight group-hover:text-cyan-400 transition-colors">{tool.title}</h3>
                 <div className="flex items-center gap-3">
                    <Tag className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{tool.category}</span>
                 </div>
              </div>

              <div className="mt-auto flex items-center justify-between pt-10 border-t border-white/5">
                 <div className="flex flex-col">
                    <span className="text-2xl font-black text-white tracking-tighter italic">{tool.price}</span>
                    <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest mt-1">One-Time_License</span>
                 </div>
                 <button className="p-4 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl">
                    <ShoppingCart className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sell Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative p-12 bg-white/[0.02] border border-white/10 rounded-[48px] overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-none" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Monetize Your Intel</h2>
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] max-w-md leading-relaxed">List your high-performance prompts and diagnostic filters on the Global Tool Store.</p>
           </div>
           <button className="px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-cyan-400 transition-all shadow-2xl flex items-center gap-3 group/btn">
              Open Seller Portal
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
