"use client";

import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import { motion } from "framer-motion";
import { Globe, Users, TrendingUp } from "lucide-react";
import { useState } from "react";

const filters = [
  { label: "For You", icon: Globe },
  { label: "Following", icon: Users },
  { label: "Intelligence", icon: TrendingUp },
];

export default function Home() {
  const [active, setActive] = useState("For You");

  return (
    <div className="max-w-[640px] mx-auto w-full space-y-0">
      {/* FEED HEADER */}
      <div className="flex items-center border-b border-white/5 sticky top-0 z-30 bg-[#05050a]/60 backdrop-blur-2xl">
        {filters.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`flex-1 flex flex-col items-center justify-center pt-4 pb-0 text-sm font-bold transition-all relative ${
              active === label ? "text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
               {label}
            </div>
            {active === label && (
              <motion.div
                layoutId="feed-tab"
                className="w-14 h-[3px] bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* CREATE POST */}
      <div className="border-b border-white/5 px-4 py-4">
        <CreatePost />
      </div>

      {/* FEED */}
      <div className="divide-y divide-white/[0.04] mt-4">
        <PostFeed />
      </div>
    </div>
  );
}
