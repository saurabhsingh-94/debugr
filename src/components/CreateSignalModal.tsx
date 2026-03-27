"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertTriangle, Cpu, Tag as TagIcon, Loader2 } from "lucide-react";
import { submitProblem } from "@/app/actions";
import toast from "react-hot-toast";

interface CreateSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSignalModal({ isOpen, onClose }: CreateSignalModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("tags", formData.tags);

      await submitProblem(data);
      toast.success("Signal published successfully");
      onClose();
      setFormData({ title: "", description: "", tags: "" });
    } catch (error) {
      toast.error("Submission failed: Protocol error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative z-10 p-8 md:p-12 ring-1 ring-white/5"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-accent-cyan" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Post Signal</h3>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Share your recent findings</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-zinc-500 group-hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Signal Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Critical Logic Error in GPT-4"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Technical Details</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide technical details of the signal..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30 transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <TagIcon className="w-3 h-3" />
                  Tags
                </label>
                <input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="nextjs, prisma, neon (comma separated)"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 px-5 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-[9px] font-bold text-zinc-500 leading-relaxed tracking-wider uppercase">
                  Verify all data before posting. <span className="text-white">Inaccurate signals</span> may result in system reputation penalties.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-cyan text-black font-black uppercase tracking-widest text-[11px] py-4 rounded-xl mt-6 hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(94,234,212,0.2)] flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    POSTING...
                  </>
                ) : (
                  <>
                    Broadcast Signal
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
