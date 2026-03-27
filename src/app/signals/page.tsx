"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldAlert, Cpu, Network, Plus, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { postSignal } from "../actions";

export default function SignalsPage() {
  const [showPost, setShowPost] = useState(false);
  const [signals, setSignals] = useState<any[]>([]);

  // In a real app, this would be a server component fetch, 
  // but for the "Post" demo, we'll use a client-side mock that we can update.
  useEffect(() => {
    // Initial mock data if DB is empty for demo
    setSignals([
      { id: "SIG-0842", type: "NEURAL_OVERLOAD", origin: "CLUSTER_A", priority: "CRITICAL", strength: "94%" },
      { id: "SIG-1294", type: "BUFFER_OVERFLOW", origin: "GATEWAY_3", priority: "WARNING", strength: "72%" },
    ]);
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-zinc-400" />
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">SIGNAL_MONITOR</h1>
          </div>
          <p className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase">Real-time AI behavioral analysis and anomaly detection</p>
        </div>
        <button 
          onClick={() => setShowPost(true)}
          className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 group"
        >
          <Plus className="w-4 h-4" /> POST_SIGNAL
        </button>
      </div>

      {/* Signal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {signals.map((sig, i) => (
          <motion.div 
            key={sig.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-white/[0.01] rounded-[32px] border border-white/10 backdrop-blur-md group-hover:bg-white/[0.03] group-hover:border-white/20 transition-all" />
            <div className="relative p-6 flex flex-col items-center text-center">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border",
                sig.priority === "CRITICAL" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                sig.priority === "WARNING" ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
              )}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-[8px] font-mono text-zinc-600 mb-2">{sig.id}</span>
              <h3 className="text-xs font-black text-white uppercase tracking-widest italic">{sig.type}</h3>
              <div className="mt-6 flex flex-col gap-1 w-full pt-6 border-t border-white/5">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                   <span className="text-zinc-700">Origin</span>
                   <span className="text-zinc-400">{sig.origin}</span>
                </div>
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                   <span className="text-zinc-700">Strength</span>
                   <span className="text-zinc-400">{sig.strength}</span>
                </div>
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
              className="w-full max-w-lg relative bg-[#0A0A0A] border border-white/10 rounded-[40px] p-10 overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <button 
                onClick={() => setShowPost(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Initialize Signal</h2>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Transmit new behavioral anomaly to the network</p>
                </div>

                <form action={async (formData) => {
                  await postSignal(formData);
                  setShowPost(false);
                }} className="space-y-6">
                  <div className="space-y-4">
                    <input name="type" placeholder="SIGNAL_TYPE (e.g. NEURAL_OVERLOAD)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-white/20 transition-all" required />
                    <input name="origin" placeholder="DETECTION_ORIGIN (e.g. CLUSTER_X)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-white/20 transition-all" required />
                    <select name="priority" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer">
                      <option value="INFO">INFO_LEVEL</option>
                      <option value="WARNING">WARNING_LEVEL</option>
                      <option value="CRITICAL">CRITICAL_LEVEL</option>
                    </select>
                    <input name="strength" placeholder="SIGNAL_STRENGTH (e.g. 98%)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-white/20 transition-all" required />
                  </div>

                  <button type="submit" className="w-full py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all">
                    TRANSMIT_DATA <Send className="w-4 h-4" />
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
