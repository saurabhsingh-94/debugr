"use client";

import { ChevronUp, ChevronDown, MessageSquare, Share2, MoreHorizontal, ArrowBigUp, ArrowBigDown } from "lucide-react";
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
  variant?: "default" | "profile";
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
  variant = "default",
}: SignalCardProps) {
  const isProfile = variant === "profile";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "ghost-card flex flex-col md:flex-row gap-8 group cursor-pointer",
        isProfile ? "p-6" : "p-8"
      )}
    >
      {/* LEFT: ENGAGEMENT */}
      <div className="flex flex-col items-center gap-4 py-4 px-2 border-r border-white/5">
        <button className="p-3 rounded-2xl bg-white/[0.03] hover:bg-violet-500/20 group/btn transition-all">
          <ArrowBigUp className="w-6 h-6 text-zinc-600 group-hover/btn:text-violet-400 group-hover/btn:scale-110 transition-all" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-lg font-black text-white italic leading-none">{painScore.toFixed(0)}</span>
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-1">Impact</span>
        </div>
        <button className="p-3 rounded-2xl bg-white/[0.03] hover:bg-rose-500/20 group/btn transition-all">
          <ArrowBigDown className="w-6 h-6 text-zinc-600 group-hover/btn:text-rose-400 group-hover/btn:scale-110 transition-all" />
        </button>
      </div>

      {/* CENTER: SIGNAL DETAILS */}
      <div className="flex-1 p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <h3 className="text-2xl font-serif text-zinc-200 group-hover:text-white transition-colors duration-700 leading-tight">
            {title}
          </h3>
          
          {isUnique && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 italic">Unique</span>
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-500 leading-relaxed font-medium italic group-hover:text-zinc-300 transition-colors duration-700">
          "{description}"
        </p>

        <div className="flex items-center gap-3 flex-wrap pt-2">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 hover:text-white transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
          
        <div className="flex flex-col md:flex-row md:items-center gap-8 pt-6 border-t border-white/[0.03]">
          <div className="flex flex-col gap-2 flex-1 md:flex-none">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">Pain Index</span>
               <span className="text-[10px] font-bold text-white italic">{painScore.toFixed(1)}</span>
            </div>
            <div className="w-full md:w-32 h-[1px] bg-white/[0.05] relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${painScore * 10}%` }}
                className="h-full bg-white absolute left-0 top-0"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between md:justify-start gap-8 md:flex-1">
            <div className="flex items-center gap-2 text-zinc-600 group-hover:text-zinc-400 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-tight">{commentCount}</span>
            </div>
            
            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <button className="text-zinc-700 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="text-zinc-700 hover:text-white transition-colors">
                 <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
