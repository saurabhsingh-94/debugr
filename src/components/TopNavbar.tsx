"use client";

import { ChevronRight, UserPlus, Bell, ChevronDown } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="h-20 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-40 px-10 flex items-center justify-between">
      <div className="flex items-center gap-3 text-sm font-medium">
        <span className="text-zinc-500">Home</span>
        <ChevronRight className="w-4 h-4 text-zinc-700" />
        <span className="text-zinc-500">Dashboard</span>
        <ChevronRight className="w-4 h-4 text-zinc-700" />
        <span className="text-white">Analytics</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
            </div>
          ))}
          <button className="w-8 h-8 rounded-full border-2 border-background bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
            <UserPlus className="w-3 h-3" />
          </button>
        </div>

        <button className="px-5 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan text-[11px] font-bold rounded-lg border border-accent-cyan/20 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          Invite
        </button>

        <div className="h-6 w-px bg-border mx-2" />

        <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-red rounded-full" />
        </button>

        <button className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-accent-cyan">SS</span>
          </div>
          <ChevronDown className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </button>
      </div>
    </header>
  );
}
