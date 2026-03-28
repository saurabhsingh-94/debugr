"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
    >
      <Printer className="w-4 h-4" />
    </button>
  );
}
