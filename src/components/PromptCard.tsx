"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Copy, Zap, Info, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface PromptCardProps {
  id: string;
  title: string;
  thumbnail: string;
  model: string;
  price: string;
  prompt: string;
  initialLocked?: boolean;
}

export default function PromptCard({ 
  id, 
  title, 
  thumbnail, 
  model, 
  price, 
  prompt, 
  initialLocked = true 
}: PromptCardProps) {
  const [isLocked, setIsLocked] = useState(initialLocked);
  const [isHovered, setIsHovered] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const handleCopy = () => {
    if (isLocked) return;
    navigator.clipboard.writeText(prompt);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleUnlock = () => {
    // Mock unlock logic
    setIsLocked(false);
  };

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-[4/5] overflow-hidden group border-[0.5px] border-white/5 cursor-pointer bg-zinc-900"
    >
      {/* THUMBNAIL */}
      <Image 
        src={thumbnail} 
        alt={title} 
        fill 
        className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${isHovered ? 'filter blur-[2px] opacity-40' : 'filter grayscale-[0.5] group-hover:grayscale-0'}`}
      />

      {/* GHOST_OVERLAY */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 p-6 flex flex-col justify-between backdrop-blur-sm bg-black/60"
          >
            {/* TOP_INFO */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                   {model}
                </span>
                <p className="text-lg font-serif text-white italic leading-tight pt-2">{title}</p>
              </div>
              <div className="p-2 bg-white/5 rounded-full border border-white/10">
                {isLocked ? <Lock className="w-3 h-3 text-zinc-500" /> : <Unlock className="w-3 h-3 text-emerald-500" />}
              </div>
            </div>

            {/* CENTER_CONTENT (LOCKED/UNLOCKED) */}
            <div className="flex-1 flex items-center justify-center p-4">
               {isLocked ? (
                  <div className="text-center space-y-4">
                     <div className="relative">
                        <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em] blur-[3px] select-none">
                           {prompt.substring(0, 100)}...
                        </p>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <ShieldCheck className="w-8 h-8 text-white/10" />
                        </div>
                     </div>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic">Prompt Encrypted</p>
                  </div>
               ) : (
                  <div className="w-full">
                     <p className="text-[10px] text-zinc-300 font-medium leading-relaxed tracking-tight italic line-clamp-4">
                        {prompt}
                     </p>
                  </div>
               )}
            </div>

            {/* BOTTOM_ACTIONS */}
            <div className="pt-4 border-t border-white/5 space-y-4">
               {isLocked ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUnlock(); }}
                    className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                     Unlock Profile for {price}
                  </button>
               ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                    className="w-full py-3 bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white hover:text-black"
                  >
                     {showCopyFeedback ? "Registry Copied" : "Copy Registry"}
                     <Copy className="w-3 h-3" />
                  </button>
               )}
               <div className="flex items-center justify-center gap-2 opacity-30">
                  <Zap className="w-3 h-3 text-zinc-500" />
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Diagnostic Level 4 Integrity</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATIC_STATUS_ONLY_WHEN_NOT_HOVERED */}
      <div className={`absolute bottom-3 left-3 z-0 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
         {isLocked ? (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
               <Lock className="w-2.5 h-2.5 text-zinc-500" />
               <span className="text-[8px] font-bold text-white tracking-widest">{price}</span>
            </div>
         ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/20">
               <Unlock className="w-2.5 h-2.5 text-emerald-500" />
               <span className="text-[8px] font-bold text-emerald-500 tracking-widest uppercase">Unlocked</span>
            </div>
         )}
      </div>
    </motion.div>
  );
}
