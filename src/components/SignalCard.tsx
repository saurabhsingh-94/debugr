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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.002, borderColor: "rgba(255, 255, 255, 0.2)" }}
      className="terminal-panel rounded-sm p-6 flex gap-6 group transition-all duration-200 border-white/5"
    >
      {/* LEFT: VOTES */}
      <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
        <button className="p-1 hover:text-white transition-colors text-zinc-600">
          <ChevronUp className="w-5 h-5" />
        </button>
        <span className="text-xl font-bold tracking-tighter text-white font-mono">
          {votes >= 1000 ? `${(votes / 1000).toFixed(1)}k` : votes}
        </span>
        <button className="p-1 hover:text-white transition-colors text-zinc-600 opacity-40 hover:opacity-100">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* CENTER: CONTENT */}
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-zinc-300 transition-colors">
            {title}
          </h3>
          
          {mergedFrom ? (
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 text-zinc-400 rounded-sm">
              MERGED_{mergedFrom}
            </span>
          ) : isUnique ? (
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 text-white rounded-sm">
              UNIQUE
            </span>
          ) : null}
        </div>

        <p className="text-sm text-zinc-500 line-clamp-2 font-medium">
          {description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[9px] font-bold uppercase tracking-widest border border-white/5 px-2.5 py-1 rounded-sm text-zinc-500 hover:border-white/20 hover:text-white transition-all cursor-pointer"
            >
              {tag}
            </span>
          ))}
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-6 text-zinc-600">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold uppercase tracking-widest">SENSITIVITY</span>
              <div className="w-24 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${painScore * 10}%` }}
                  className="h-full bg-white opacity-40"
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-white">{painScore.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-4 border-l border-white/5 pl-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">{commentCount}</span>
              </div>
              <button className="hover:text-white transition-colors">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
