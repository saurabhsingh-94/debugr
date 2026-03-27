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

const mockPrompts = [
  {
    id: "1",
    title: "Cybernetic Monolith",
    thumbnail: "/marketplace/marketplace_thumb_cybernetic_1774544429086.png",
    model: "MIDJOURNEY_V6",
    price: "$12.00",
    prompt: "A high-fidelity, hyper-realistic cybernetic architecture visualization. Brutalist concrete merged with neon-integrated circuitry. Vertical gardens on obsidian monoliths. Ethereal atmospheric fog. 8k resolution, cinematic lighting, conceptual art. Style: Ghost Minimalist.",
    initialLocked: true
  },
  {
    id: "2",
    title: "Ethereal Haven",
    thumbnail: "/marketplace/marketplace_thumb_ethereal_1774544446702.png",
    model: "SDXL_TURBO",
    price: "$8.50",
    prompt: "An ethereal, dreamlike landscape of floating translucent islands connected by white light filaments. Volumetric clouds with soft iridescent gradients. Minimalist white structures. Peaceful, high-fantasy, high-fidelity conceptual art. Style: Ghost Minimalist.",
    initialLocked: true
  },
  {
    id: "3",
    title: "Obsidian Flow",
    thumbnail: "/marketplace/marketplace_thumb_obsidian_1774544486807.png",
    model: "DALL-E_3",
    price: "$15.00",
    prompt: "Dark obsidian liquid flowing through a white minimalist architectural room. Sharp contrasts, high-fidelity surfaces, volumetric lighting. Abstract but structural. 8k, cinematic, conceptual art. Style: Ghost Minimalist.",
    initialLocked: true
  },
  // Duplicating for density demonstration
  {
    id: "4",
    title: "Cybernetic Monolith Alpha",
    thumbnail: "/marketplace/marketplace_thumb_cybernetic_1774544429086.png",
    model: "MIDJOURNEY_V6",
    price: "$12.00",
    prompt: "A high-fidelity, hyper-realistic cybernetic architecture visualization. Brutalist concrete merged with neon-integrated circuitry.",
    initialLocked: true
  },
  {
    id: "5",
    title: "Ethereal Haven Beta",
    thumbnail: "/marketplace/marketplace_thumb_ethereal_1774544446702.png",
    model: "SDXL_TURBO",
    price: "$8.50",
    prompt: "An ethereal, dreamlike landscape of floating translucent islands connected by white light filaments.",
    initialLocked: false
  },
  {
    id: "6",
    title: "Obsidian Flow Gamma",
    thumbnail: "/marketplace/marketplace_thumb_obsidian_1774544486807.png",
    model: "DALL-E_3",
    price: "$15.00",
    prompt: "Dark obsidian liquid flowing through a white minimalist architectural room.",
    initialLocked: true
  },
];

export default function MarketplacePage() {
  const [activeChannel, setActiveChannel] = useState("All Intelligence");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-12">
      <PostPromptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* ATLAS_MARKETPLACE_HEADER */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Registry_Gallery_Stable</span>
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
               Initiate Registry
            </button>
            <div className="hidden lg:flex items-center gap-4 px-6 py-4 bg-white/[0.02] border border-white/5 rounded-full text-zinc-600 focus-within:text-white transition-colors group">
              <Search className="w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search registries..." 
                className="bg-transparent border-none outline-none text-[11px] font-medium tracking-tight w-48 focus:w-64 transition-all duration-700"
              />
            </div>
            <button className="p-4 bg-white/[0.02] border border-white/5 rounded-full text-zinc-600 hover:text-white transition-colors">
               <SlidersHorizontal className="w-4 h-4" />
            </button>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {mockPrompts.map((prompt) => (
          <PromptCard key={prompt.id} {...prompt} />
        ))}
        {/* Fill the grid more */}
        {mockPrompts.map((prompt) => (
          <PromptCard key={`${prompt.id}-dup`} {...prompt} />
        ))}
      </div>

      {/* ATLAS_FLOATING_SORT */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
         <div className="flex items-center gap-2 p-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
            {["Community", "Trending", "Latest"].map((sort) => (
               <button 
                 key={sort}
                 className="px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
               >
                  {sort}
               </button>
            ))}
            <div className="w-[1px] h-4 bg-white/10 mx-2" />
            <div className="flex items-center gap-3 px-4">
               <LayoutGrid className="w-3 h-3 text-white" />
               <Grid2X2 className="w-3 h-3 text-zinc-800 hover:text-white transition-colors" />
            </div>
         </div>
      </div>

      {/* FOOTER_INFO */}
      <div className="pt-32 pb-20 text-center space-y-4">
         <Zap className="w-6 h-6 text-zinc-800 mx-auto" />
         <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.5em]">Synchronizing Intelligence Registries</p>
      </div>
    </div>
  );
}
