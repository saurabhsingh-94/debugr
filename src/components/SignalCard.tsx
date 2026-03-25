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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.005 }}
      className="terminal-panel rounded-2xl p-7 flex gap-8 group transition-all duration-500 relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* LEFT: VOTES */}
      <div className="flex flex-col items-center gap-2 min-w-[64px] bg-white/[0.03] rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
        <button className="p-1.5 hover:text-white transition-colors text-zinc-600 hover:bg-white/5 rounded-lg">
          <ChevronUp className="w-5 h-5" />
        </button>
        <span className="text-xl font-bold tracking-tighter text-white font-mono">
          {votes >= 1000 ? `${(votes / 1000).toFixed(1)}k` : votes}
        </span>
        <button className="p-1.5 hover:text-white transition-colors text-zinc-600 hover:bg-white/5 rounded-lg opacity-40 hover:opacity-100">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* CENTER: CONTENT */}
      <div className="flex-1 space-y-5">
        <div className="flex items-start justify-between gap-6">
          <h3 className="text-xl font-bold text-white/90 leading-tight group-hover:text-white transition-colors tracking-tight">
            {title}
          </h3>
          
          {mergedFrom ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                MERGED_{mergedFrom}
              </span>
            </div>
          ) : isUnique ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-white">
                UNIQUE_SIGNAL
              </span>
            </div>
          ) : null}
        </div>

        <p className="text-[15px] text-zinc-500 line-clamp-2 leading-relaxed font-medium">
          {description}
        </p>

        <div className="flex items-center gap-2 flex-wrap pt-2">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[8px] font-bold uppercase tracking-[0.2em] border border-white/5 bg-white/[0.02] px-3 py-1.5 rounded-lg text-zinc-500 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              {tag}
            </span>
          ))}
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-8 text-zinc-600">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[7px] font-bold uppercase tracking-widest text-zinc-700">PAIN_METRIC</span>
                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-white/5" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${painScore * 10}%` }}
                    className="h-full bg-white/40 absolute left-0 top-0 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-white/80 font-mono tracking-tighter">{painScore.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-5 border-l border-white/10 pl-8">
              <div className="flex items-center gap-2 group/msg cursor-pointer">
                <MessageSquare className="w-4 h-4 group-hover/msg:text-white transition-colors" />
                <span className="text-[10px] font-bold font-mono group-hover/msg:text-white transition-colors">{commentCount}</span>
              </div>
              <button className="hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
