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
      whileHover={{ scale: 1.005, backgroundColor: "rgba(17, 24, 39, 0.8)" }}
      className="terminal-panel rounded-lg p-6 flex gap-6 group transition-all duration-200"
    >
      {/* LEFT: VOTES */}
      <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
        <button className="p-1 hover:text-accent transition-colors">
          <ChevronUp className="w-5 h-5" />
        </button>
        <span className="text-xl font-black tracking-tighter text-white font-mono">
          {votes >= 1000 ? `${(votes / 1000).toFixed(1)}k` : votes}
        </span>
        <button className="p-1 hover:text-red-400 transition-colors opacity-40 hover:opacity-100">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* CENTER: CONTENT */}
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-accent transition-colors">
            {title}
          </h3>
          
          {mergedFrom ? (
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-secondary/10 border border-secondary/20 text-secondary rounded italic whitespace-nowrap">
              MERGED FROM {mergedFrom} TOPICS
            </span>
          ) : isUnique ? (
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-accent/10 border border-accent/20 text-accent rounded italic whitespace-nowrap">
              UNIQUE ENTRY
            </span>
          ) : null}
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 font-medium">
          {description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[9px] font-bold uppercase tracking-widest border border-white/10 px-2.5 py-1 rounded text-gray-500 hover:border-accent hover:text-accent transition-all cursor-pointer"
            >
              {tag}
            </span>
          ))}
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-6 text-gray-500">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold uppercase tracking-widest">Pain Score</span>
              <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${painScore * 10}%` }}
                  className="h-full bg-accent shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-accent">{painScore.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-4 border-l border-white/5 pl-6">
              <button className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase">{commentCount}</span>
              </button>
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
