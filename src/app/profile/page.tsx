"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Signal, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  Award,
  Zap,
  BarChart3,
  ExternalLink,
  Edit3
} from "lucide-react";
import SignalCard from "@/components/SignalCard";
import { cn } from "@/lib/utils";

const USER_DATA = {
  name: "Saurabh S.",
  handle: "@curator_root",
  bio: "AI Architect & Terminal Curator. Solving recursive loops and hallucination vectors across the LLM stack.",
  stats: [
    { label: "Signals", value: "842" },
    { label: "Followers", value: "12.4k" },
    { label: "Following", value: "1.2k" },
    { label: "Solves", value: "156" }
  ],
  metrics: [
    { label: "Total Signals", value: "2.8k", sub: "+12% this month" },
    { label: "Avg. Pain Score", value: "8.4", sub: "Top 2% curator" },
    { label: "Successful Solves", value: "156", sub: "94% resolution rate" }
  ],
  topContributions: [
    { title: "Recursive Agent Loop in GPT-4o", priority: 9.4, date: "2 days ago" },
    { title: "Vector DB Latency Spike (A-1)", priority: 8.5, date: "5 days ago" },
    { title: "Ouroboros Prompt Injection", priority: 7.8, date: "1 week ago" }
  ]
};

const MOCK_SIGNALS = [
  {
    id: "1",
    title: "GPT-4 Context Window 'Memory Leak' in Long-Form Reasoning",
    description: "Users report significant degradation in output consistency after 32k tokens in recursive reasoning tasks.",
    tags: ["AI", "LLM", "ARCHITECTURE"],
    votes: 412,
    painScore: 8.5,
    mergedFrom: 12,
    commentCount: 84
  },
  {
    id: "2",
    title: "Inconsistent Type Generation in TypeScript Codegen Flows",
    description: "Codegen consistently hallucinates nested interface structures when dealing with complex GraphQL schemas.",
    tags: ["CODING", "TYPESCRIPT"],
    votes: 1200,
    painScore: 6.2,
    mergedFrom: 5,
    commentCount: 152
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Signals");

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* 1. PROFILE HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-card border border-white/10 shadow-2xl mx-1 md:mx-0">
        {/* Banner */}
        <div className="h-32 md:h-48 w-full bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-500/30 animate-pulse-slow" />
        
        <div className="px-5 md:px-8 pb-8 flex flex-col items-start -mt-10 md:-mt-12 relative z-10">
          <div className="flex w-full items-end justify-between">
            {/* Avatar Overlap */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-900 border-4 border-[#0a0f14] flex items-center justify-center overflow-hidden shadow-2xl ring-1 ring-white/10">
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                 <span className="text-2xl md:text-3xl font-black text-white/20">SS</span>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white text-black rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-xl">
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
          </div>

          <div className="mt-4 space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{USER_DATA.name}</h1>
            <p className="text-sm font-mono text-zinc-500">{USER_DATA.handle}</p>
          </div>

          <p className="mt-4 text-zinc-400 max-w-2xl text-xs md:text-sm leading-relaxed font-medium">
            {USER_DATA.bio}
          </p>

          <div className="mt-6 flex items-center gap-4 md:gap-8 border-t border-white/5 pt-6 w-full overflow-x-auto no-scrollbar">
            {USER_DATA.stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 shrink-0">
                <span className="text-xs md:text-sm font-black text-white tracking-tighter">{stat.value}</span>
                <span className="text-[9px] md:text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT (2 COLUMN) */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* LEFT COLUMN: FEED */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          <div className="flex items-center gap-2 border-b border-white/5 pb-px overflow-x-auto no-scrollbar">
            {["Signals", "Activity", "Solutions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative shrink-0",
                  activeTab === tab ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="profile-tab-glow"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_10px_white]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 px-4 md:px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
               <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
               <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pinned Signal</span>
            </div>
            {MOCK_SIGNALS.map((signal) => (
              <SignalCard key={signal.id} {...signal} variant="profile" />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="lg:col-span-3 space-y-8 order-last lg:order-none">
          
          {/* Reputation Metrics */}
          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Reputation Metrics</h3>
            <div className="space-y-6">
               {USER_DATA.metrics.map((m) => (
                 <div key={m.label} className="space-y-1">
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-zinc-300">{m.label}</span>
                     <span className="text-sm font-black text-white">{m.value}</span>
                   </div>
                   <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{m.sub}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Top Contributions */}
          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Top Contributions</h3>
             <div className="space-y-4">
               {USER_DATA.topContributions.map((c) => (
                 <div key={c.title} className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 truncate w-40 group-hover:text-white transition-colors">{c.title}</span>
                      <span className="text-[9px] font-mono font-black text-cyan-400">{c.priority}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">{c.date}</span>
                      <ExternalLink className="w-3 h-3 text-zinc-800 group-hover:text-zinc-400 transition-colors" />
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Active Bounties */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Award className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-4">Active Bounties</h3>
            <p className="text-[11px] text-zinc-400 font-medium mb-4 leading-relaxed">
              Solve current AI hallucinations to earn reputation multipliers.
            </p>
            <button className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
               Browse Bounties
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
