"use client";

import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import { motion } from "framer-motion";
import { Flame, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

const filters = [
  { label: "Latest", icon: Clock },
  { label: "Hot", icon: Flame },
  { label: "Top", icon: TrendingUp },
];

export default function Home() {
  const [active, setActive] = useState("Latest");

  return (
    <div className="max-w-[640px] mx-auto w-full space-y-0">
      {/* FEED HEADER */}
      <div className="flex items-center border-b border-white/5 mb-8 sticky top-0 z-30 bg-[#05050a]/80 backdrop-blur-xl">
        {filters.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${
              active === label ? "text-white" : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {active === label && (
              <motion.div
                layoutId="feed-tab"
                className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-white rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* CREATE POST */}
      <div className="border-b border-white/5 mb-10">
        <CreatePost />
      </div>

      {/* FEED */}
      <div className="divide-y divide-white/[0.04] mt-4">
        <PostFeed />
      </div>
    </div>
  );
}
