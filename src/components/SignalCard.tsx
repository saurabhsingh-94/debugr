"use client";

import { ChevronUp, ChevronDown, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SignalCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  painScore: number;
  mergedFrom?: number;
  isUnique?: boolean;
  commentCount: number;
}

export default function SignalCard({
  title,
  description,
  tags,
  votes,
  painScore,
  mergedFrom,
  isUnique,
  commentCount,
}: SignalCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="terminal-panel rounded-3xl p-8 flex gap-8 group transition-shadow duration-500 relative overflow-hidden ring-1 ring-white/10 hover:ring-white/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      
      {/* LEFT: VOTES */}
      <div className="flex flex-col items-center gap-3 min-w-[72px] bg-white/[0.02] rounded-2xl p-4 border border-white/5 group-hover:bg-white/[0.04] transition-all duration-500">
        <button className="p-2 hover:text-white transition-all text-zinc-600 hover:bg-white/5 rounded-xl active:scale-90">
          <ChevronUp className="w-6 h-6" />
        </button>
        <span className="text-2xl font-bold tracking-tighter text-white/90 font-mono">
          {votes >= 1000 ? `${(votes / 1000).toFixed(1)}k` : votes}
        </span>
        <button className="p-2 hover:text-white transition-all text-zinc-600 hover:bg-white/5 rounded-xl opacity-40 hover:opacity-100 active:scale-90">
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* CENTER: CONTENT */}
      <div className="flex-1 space-y-6">
        <div className="flex items-start justify-between gap-8">
          <h3 className="text-2xl font-bold text-white/90 leading-tight group-hover:text-white transition-colors tracking-tight">
            {title}
          </h3>
          
          {mergedFrom ? (
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-md">
              <span className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                MERGED_{mergedFrom}
              </span>
            </div>
          ) : isUnique ? (
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white/[0.08] border border-white/20 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                UNIQUE_SIGNAL
              </span>
            </div>
          ) : null}
        </div>

        <p className="text-[17px] text-zinc-500 line-clamp-2 leading-relaxed font-medium transition-colors group-hover:text-zinc-400">
          {description}
        </p>

        <div className="flex items-center gap-3 flex-wrap pt-4">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[9px] font-bold uppercase tracking-[0.25em] border border-white/5 bg-white/[0.01] px-4 py-2 rounded-xl text-zinc-600 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              {tag}
            </span>
          ))}
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-10 text-zinc-600">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-800">PAIN_METRIC</span>
                <div className="w-32 h-1 bg-white/[0.03] rounded-full overflow-hidden relative ring-1 ring-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${painScore * 10}%` }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-zinc-500 to-white/60 absolute left-0 top-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-white/70 font-mono tracking-tighter">{painScore.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-6 border-l border-white/10 pl-10">
              <div className="flex items-center gap-3 group/msg cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover/msg:border-white/20 transition-all">
                  <MessageSquare className="w-4 h-4 group-hover/msg:text-white transition-colors" />
                </div>
                <span className="text-[12px] font-bold font-mono group-hover/msg:text-white transition-colors tracking-tighter">{commentCount}</span>
              </div>
              <button className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center hover:border-white/20 transition-all group/share">
                <Share2 className="w-4 h-4 group-hover/share:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
