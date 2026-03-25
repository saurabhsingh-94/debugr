"use client";

import { Plus } from "lucide-react";

export default function FAB() {
  return (
    <button className="fixed bottom-8 right-8 w-14 h-14 bg-white text-black rounded-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center group z-50">
      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
    </button>
  );
}
