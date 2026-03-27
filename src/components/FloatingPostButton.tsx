"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, PenSquare, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import CreatePost from "./CreatePost";
import PostPromptModal from "./PostPromptModal";

export default function FloatingPostButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="flex flex-col gap-3"
            >
              <button
                onClick={() => { setShowPromptModal(true); setIsOpen(false); }}
                className="flex items-center gap-3 px-6 py-3 bg-[#0c0c12] border border-white/10 rounded-2xl text-white hover:bg-white/5 transition-all group"
              >
                <span className="text-[11px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Sell Prompt</span>
                <ShoppingBag className="w-5 h-5 text-violet-400" />
              </button>
              <button
                onClick={() => { setShowPostModal(true); setIsOpen(false); }}
                className="flex items-center gap-3 px-6 py-3 bg-[#0c0c12] border border-white/10 rounded-2xl text-white hover:bg-white/5 transition-all group"
              >
                <span className="text-[11px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Share Intel</span>
                <PenSquare className="w-5 h-5 text-emerald-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shadow-2xl ${
            isOpen ? "bg-white text-black rotate-45" : "bg-violet-600 text-white hover:bg-violet-500"
          }`}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-[600px] bg-[#0c0c12] border border-white/10 rounded-[40px] p-8 relative">
              <button onClick={() => setShowPostModal(false)} className="absolute top-6 right-6 p-3 rounded-2xl hover:bg-white/5 text-zinc-600">
                <X className="w-4 h-4" />
              </button>
              <CreatePost onPostSuccess={() => setShowPostModal(false)} />
            </div>
          </div>
        )}

        {showPromptModal && (
          <PostPromptModal onClose={() => setShowPromptModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
