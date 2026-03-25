"use client";

import { Search, Filter, SlidersHorizontal, UserCircle } from "lucide-react";

export default function TopHeader() {
  return (
    <header className="h-16 fixed top-0 right-0 left-64 bg-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
      <div className="flex flex-col">
          <span className="text-xs font-black italic tracking-tighter uppercase text-white bg-white/5 px-2 py-0.5 rounded">DEBUGR</span>
        <p className="text-[10px] font-mono text-gray-500 uppercase mt-1">
          Aggregating 1,402 unresolved AI bottlenecks
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-panel border border-white/10 text-[10px] font-bold text-gray-400 hover:text-white hover:border-accent/40 transition-all uppercase tracking-widest">
            <SlidersHorizontal className="w-3 h-3" />
            Sort: Newest
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-panel border border-white/10 text-[10px] font-bold text-gray-400 hover:text-white hover:border-accent/40 transition-all uppercase tracking-widest">
            <Filter className="w-3 h-3" />
            Filter: High Pain
          </button>
        </div>
        
        <div className="h-6 w-[1px] bg-white/10 mx-2" />
        
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-tighter">CURATOR_ROOT</span>
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
