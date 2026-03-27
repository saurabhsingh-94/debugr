"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ShieldCheck, DollarSign, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { postPrompt } from "@/app/actions";
import { toast } from "react-hot-toast";

interface PostPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess?: () => void;
}

const categories = [
  "Artistic", "Code", "Marketing", "Scientific", "Writing"
];

const aiModels = [
  "GPT-4", "Claude 3.5 Sonnet", "Midjourney v6", "DALL-E 3", "Llama 3"
];

export default function PostPromptModal({ isOpen, onClose, onPostSuccess }: PostPromptModalProps) {
  const [activeCategory, setActiveCategory] = useState("Artistic");
  const [activeModel, setActiveModel] = useState("GPT-4");
  const [currency, setCurrency] = useState("INR");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      formData.append("category", activeCategory);
      formData.append("aiModel", activeModel);
      formData.append("currency", currency);
      
      await postPrompt(formData);
      toast.success("Prompt listed successfully");
      onPostSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error("Process failed: " + err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-[#080808] border border-white/10 rounded-[40px] overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* MODAL_HEADER */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">List New Prompt</span>
                </div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sell <span className="text-zinc-700">Intelligence</span></h2>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-zinc-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL_FORM */}
            <form action={handleSubmit} className="p-8 space-y-8 overflow-y-auto scrollbar-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Title</label>
                    <input name="title" type="text" placeholder="Title of your prompt..." className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all" required />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Price</label>
                    <div className="flex gap-2">
                       <button type="button" onClick={() => setCurrency("INR")} className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all border ${currency === 'INR' ? 'bg-white text-black border-white' : 'bg-white/[0.02] text-zinc-600 border-white/5'}`}>INR</button>
                       <button type="button" onClick={() => setCurrency("USD")} className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all border ${currency === 'USD' ? 'bg-white text-black border-white' : 'bg-white/[0.02] text-zinc-600 border-white/5'}`}>USD</button>
                       <input name="price" type="number" placeholder="Amount" className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl py-3 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">AI Model</label>
                    <div className="relative">
                      <select 
                        value={activeModel} 
                        onChange={(e) => setActiveModel(e.target.value)}
                        className="w-full bg-[#0c0c12] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all appearance-none cursor-pointer"
                      >
                        {aiModels.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 text-violet-500/50 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Image URL</label>
                    <div className="relative">
                       <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-800" />
                       <input name="thumbnailUrl" type="url" placeholder="Direct link to result image..." className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Preview</label>
                <textarea name="previewContent" rows={2} placeholder="Briefly describe what this prompt achieves (This is free to see)..." className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all resize-none" />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Full Prompt</label>
                <textarea name="fullContent" rows={4} placeholder="The actual prompt text that will be revealed ONLY after payment..." className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/50 transition-all resize-none" required />
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4 opacity-50">
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                   <div className="space-y-0.5">
                       <p className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Verified Transaction</p>
                      <p className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">Revenue distributed via Cashfree</p>
                   </div>
                </div>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 border-b-4 border-zinc-300 flex items-center gap-3"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Listing"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
