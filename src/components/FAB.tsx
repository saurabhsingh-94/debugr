"use client";

import { Plus } from "lucide-react";

export default function FAB() {
  return (
    <button className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-background rounded shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:scale-105 transition-all flex items-center justify-center group z-50">
      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
    </button>
  );
}
