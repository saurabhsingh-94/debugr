"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ArrowUpRight, ShieldCheck, Globe, Zap, Database, Plus, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { postIntelAsset } from "../actions";

const MOCK_INTEL = [
  { id: "INTEL_08X", title: "Cluster Alpha Node Leak", price: "2.4 ETH", category: "VULNERABILITY", reputation: "98" },
  { id: "INTEL_12Y", title: "Neural Gateway Bypass", price: "0.8 ETH", category: "EXPLOIT", reputation: "94" },
];

export default function ExchangePage() {
  const [showPost, setShowPost] = useState(false);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-zinc-400" />
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">INTEL_EXCHANGE</h1>
          </div>
          <p className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase">Authorized marketplace for AI problem intelligence and data acquisition</p>
        </div>
        <button 
          onClick={() => setShowPost(true)}
          className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> LIST_INTEL
        </button>
      </div>

      {/* Featured Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {MOCK_INTEL.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-white/[0.01] rounded-[40px] border border-white/10 backdrop-blur-[40px] group-hover:bg-white/[0.03] group-hover:border-white/20 transition-all shadow-2xl" />
            <div className="relative p-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-10">
                 <div className="p-3 bg-white/5 rounded-[20px] border border-white/10">
                    <Database className="w-6 h-6 text-zinc-400" />
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white tracking-widest">{item.price}</span>
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-1">Acquisition_Cost</span>
                 </div>
              </div>

              <h3 className="text-base font-black text-white uppercase italic tracking-tight mb-4 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-10">Verification_Hash: {item.id}</p>

              <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{item.reputation}% Verified</span>
                 </div>
                 <button className="flex items-center gap-2 text-[9px] font-black text-white hover:underline uppercase tracking-widest">
                    Details <ArrowUpRight className="w-3 h-3" />
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
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">List Intelligence</h2>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Register intellectual asset for distribution</p>
                </div>

                <form action={async (formData) => {
                  await postIntelAsset(formData);
                  setShowPost(false);
                }} className="space-y-6">
                  <div className="space-y-4">
                    <input name="title" placeholder="INTEL_TITLE (e.g. Cluster Alpha Leak)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white" required />
                    <input name="price" placeholder="ACQUISITION_PRICE (e.g. 2.4 ETH)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white" required />
                    <select name="category" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <option value="VULNERABILITY">VULNERABILITY_LEAK</option>
                      <option value="EXPLOIT">EXPLOIT_PAYLOAD</option>
                      <option value="DATASET">TRAINING_DATASET</option>
                    </select>
                    <textarea name="description" placeholder="INTEL_SYNOPSIS" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white h-32" required />
                  </div>

                  <button type="submit" className="w-full py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                    FINALIZE_LISTING <Send className="w-4 h-4" />
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
