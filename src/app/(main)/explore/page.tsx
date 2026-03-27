"use client";

import { useState, useTransition } from "react";
import { Search as SearchIcon, User, ShoppingBag, Hash, Loader2, ArrowRight } from "lucide-react";
import { searchEverything } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PromptCard from "@/components/PromptCard";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ users: any[], prompts: any[] }>({ users: [], prompts: [] });
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length >= 2) {
      startTransition(async () => {
        const res = await searchEverything(val);
        setResults(res);
      });
    } else {
      setResults({ users: [], prompts: [] });
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full min-h-screen px-4 py-8">
      {/* SEARCH HEADER */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
          <h1 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Discovery Engine</h1>
        </div>
        
        <div className="relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-focus-within:text-violet-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search Operators, Intelligence, or Channels (#)..."
            className="w-full bg-[#0c0c12] border border-white/5 rounded-[32px] py-6 pl-16 pr-8 text-[15px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all shadow-2xl placeholder:text-zinc-800"
          />
          {isPending && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
               <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="space-y-16">
        <AnimatePresence mode="wait">
          {query.length < 2 ? (
            <motion.div
               key="empty"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="flex flex-col items-center justify-center py-20 text-center opacity-30"
            >
               <Hash className="w-12 h-12 text-zinc-800 mb-4" />
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600">Waiting for Search</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* USERS RESULTS */}
              <div className="lg:col-span-4 space-y-6">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                       <User className="w-4 h-4 text-violet-400" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Operators</h3>
                    </div>
                    <span className="text-[9px] font-bold text-zinc-700">{results.users.length} Found</span>
                 </div>
                 
                 <div className="space-y-3">
                    {results.users.map((u) => (
                      <Link key={u.id} href={`/profile/${u.username}`} className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group">
                         <div className="w-10 h-10 rounded-2xl bg-[#111118] overflow-hidden flex-shrink-0 relative border border-white/5">
                            {u.avatarUrl ? <Image src={u.avatarUrl} alt={u.name} fill className="object-cover" /> : <User className="w-5 h-5 text-zinc-700 m-auto mt-2.5" />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors truncate">{u.name}</p>
                            <p className="text-xs text-zinc-600 truncate">@{u.username}</p>
                         </div>
                         <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                    {results.users.length === 0 && <p className="text-[10px] text-zinc-800 italic text-center py-4">No operators synchronized</p>}
                 </div>
              </div>

              {/* PROMPTS RESULTS */}
              <div className="lg:col-span-8 space-y-6">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                       <ShoppingBag className="w-4 h-4 text-emerald-400" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Marketplace Intelligence</h3>
                    </div>
                    <span className="text-[9px] font-bold text-zinc-700">{results.prompts.length} Found</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.prompts.map((p) => (
                      <PromptCard
                        key={p.id}
                        id={p.id}
                        title={p.title}
                        thumbnail={p.thumbnailUrl || "/marketplace/placeholder.png"}
                        model={p.aiModel || "GPT-4"}
                        price={`${p.currency === 'INR' ? '₹' : '$'}${p.price}`}
                        prompt={p.previewContent || p.description}
                      />
                    ))}
                 </div>
                 {results.prompts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 bg-white/[0.01] border border-white/5 rounded-[32px] opacity-30">
                       <ShoppingBag className="w-8 h-8 text-zinc-800 mb-3" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No Intelligence Registry Found</p>
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
