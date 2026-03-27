"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ShieldCheck, DollarSign, Image as ImageIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { postPrompt } from "@/app/actions";

interface PostPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  "Cybernetic",
  "Architectural",
  "Ethereal",
  "Minimalist",
  "Neural Fluid",
  "Hyper-Realistic"
];

export default function PostPromptModal({ isOpen, onClose }: PostPromptModalProps) {
  const [activeCategory, setActiveCategory] = useState("Cybernetic");

  const handleSubmit = async (formData: FormData) => {
    formData.append("category", activeCategory);
    // Mock thumbnail for demonstration
    formData.append("thumbnailUrl", "/marketplace/marketplace_thumb_obsidian_1774544486807.png"); 
    await postPrompt(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-[#080808] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl"
          >
            {/* MODAL_HEADER */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Initialize_Registry_Input</span>
                </div>
                <h2 className="text-3xl font-serif text-white italic tracking-tight uppercase">Initiate <span className="text-zinc-700">Registry</span></h2>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/[0.03] border border-white/10 rounded-full text-zinc-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL_FORM */}
            <form action={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* TITLE_INPUT */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] ml-2">Intelligence_Title</label>
                    <input 
                      name="title"
                      type="text" 
                      placeholder="e.g. Cybernetic Monolith Alpha"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[13px] text-white focus:outline-none focus:border-white/20 transition-all font-medium"
                      required
                    />
                  </div>

                  {/* PRICE_INPUT */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] ml-2">Sync_Valuation_USD</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                      <input 
                        name="price"
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[13px] text-white focus:outline-none focus:border-white/20 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* CATEGORY_SELECTION */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] ml-2">Registry_Channel</label>
                    <div className="grid grid-cols-2 gap-2">
                       {categories.map((cat) => (
                         <button
                           key={cat}
                           type="button"
                           onClick={() => setActiveCategory(cat)}
                           className={`py-3 px-4 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${activeCategory === cat ? 'bg-white text-black border-white' : 'bg-white/[0.02] text-zinc-600 border-white/5 hover:border-white/10'}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PROMPT_CONTENT */}
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] ml-2">Registry_Definition_Prompt</label>
                <textarea 
                  name="content"
                  rows={4}
                  placeholder="Insert high-fidelity prompt parameters..."
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[13px] text-white focus:outline-none focus:border-white/20 transition-all font-medium resize-none"
                  required
                />
              </div>

              {/* ACTIONS */}
              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 opacity-30">
                   <ShieldCheck className="w-4 h-4 text-zinc-500" />
                   <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Validation Protocol Active</span>
                </div>
                <button 
                  type="submit"
                  className="px-12 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-3"
                >
                  <Sparkles className="w-4 h-4" />
                  Publish Intelligence
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
