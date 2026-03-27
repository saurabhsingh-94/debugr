"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  Circle, 
  Grid2X2,
  LayoutGrid,
  Zap,
  Plus,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import PromptCard from "@/components/PromptCard";
import PostPromptModal from "@/components/PostPromptModal";

const channels = [
  "All Intelligence",
  "Cybernetic",
  "Architectural",
  "Ethereal",
  "Minimalist",
  "Neural Fluid",
  "Hyper-Realistic"
];

export default function MarketplaceClient({ initialPrompts }: { initialPrompts: any[] }) {
  const [activeChannel, setActiveChannel] = useState("All Intelligence");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrompts = initialPrompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = activeChannel === "All Intelligence" || p.category === activeChannel.toLowerCase();
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="space-y-12">
      <PostPromptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* ATLAS_MARKETPLACE_HEADER */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Intelligence Registry</span>
            </div>
            <h1 className="text-7xl lg:text-8xl font-serif text-white tracking-tighter leading-[0.8] italic uppercase">
              Prompt <br /> <span className="text-zinc-700">Market</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
            >
               <Sparkles className="w-4 h-4" />
               List Prompt
            </button>
            <div className="hidden lg:flex items-center gap-4 px-6 py-4 bg-white/[0.02] border border-white/5 rounded-full text-zinc-600 focus-within:text-white transition-colors group">
              <Search className="w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search marketplace..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[11px] font-medium tracking-tight w-48 focus:w-64 transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* ATLAS_CHANNEL_RIBBON */}
        <div className="relative">
          <div className="flex items-center gap-10 overflow-x-auto no-scrollbar py-4 border-y border-white/[0.03]">
            {channels.map((channel) => (
              <button
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${activeChannel === channel ? "text-white" : "text-zinc-700 hover:text-zinc-400"}`}
              >
                {channel}
                {activeChannel === channel && (
                  <motion.div layoutId="market-line" className="absolute -bottom-4 left-0 right-0 h-[1px] bg-white" />
                )}
              </button>
            ))}
          </div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ATLAS_GALLERY_GRID */}
      {filteredPrompts.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[48px]">
          <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">No intelligence Found</h3>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Try adjusting your spectral filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} {...prompt} author={prompt.creator?.name} authorUsername={prompt.creator?.username} />
          ))}
        </div>
      )}

      {/* FOOTER_INFO */}
      <div className="pt-32 pb-20 text-center space-y-4">
         <Zap className="w-6 h-6 text-zinc-800 mx-auto" />
         <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.5em]">Marketplace Synchronized</p>
      </div>
    </div>
  );
}

import { ShoppingBag } from "lucide-react";
