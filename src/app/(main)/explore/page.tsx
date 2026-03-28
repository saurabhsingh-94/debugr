"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Search as SearchIcon, User, ShoppingBag, Hash,
  Loader2, ArrowRight, FileText, TrendingUp, Flame
} from "lucide-react";
import { searchEverything } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PromptCard from "@/components/PromptCard";

type Tab = "all" | "people" | "prompts" | "posts";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [results, setResults] = useState<{ users: any[]; prompts: any[]; posts: any[] }>({
    users: [], prompts: [], posts: [],
  });
  const [trending, setTrending] = useState<{ tag: string; count: number; type: string }[]>([]);
  const [isPending, startTransition] = useTransition();

  // Fetch trending on mount
  useEffect(() => {
    fetch("/api/trending")
      .then((r) => r.json())
      .then((d) => setTrending(d.trending || []))
      .catch(() => {});
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length >= 2) {
      startTransition(async () => {
        const res = await searchEverything(val);
        setResults(res as any);
      });
    } else {
      setResults({ users: [], prompts: [], posts: [] });
    }
  };

  const totalResults = results.users.length + results.prompts.length + results.posts.length;
  const hasQuery = query.length >= 2;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "all", label: "All", count: totalResults },
    { id: "people", label: "People", count: results.users.length },
    { id: "prompts", label: "Prompts", count: results.prompts.length },
    { id: "posts", label: "Posts", count: results.posts.length },
  ];

  return (
    <div className="max-w-[1000px] mx-auto w-full min-h-screen px-4 py-8">

      {/* SEARCH BAR */}
      <div className="mb-8 space-y-4">
        <div className="relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-focus-within:text-violet-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search people, prompts, posts, hashtags..."
            className="w-full bg-[#0c0c12] border border-white/5 rounded-[32px] py-5 pl-16 pr-8 text-[15px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all shadow-2xl placeholder:text-zinc-800"
            autoFocus
          />
          {isPending && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
            </div>
          )}
        </div>

        {/* TABS — only show when searching */}
        {hasQuery && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white"
                    : "bg-white/[0.03] border border-white/5 text-zinc-500 hover:text-white"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-white/5"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!hasQuery ? (
          /* ── TRENDING VIEW ── */
          <motion.div
            key="trending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">Trending right now</h2>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {trending.map((item, i) => (
                <button
                  key={item.tag}
                  onClick={() => handleSearch(item.tag.replace("#", ""))}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/[0.02] transition-all group text-left rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-black text-zinc-800 w-5 text-right">{i + 1}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        {item.type === "hashtag" && <Hash className="w-3 h-3 text-violet-400" />}
                        {item.type === "category" && <ShoppingBag className="w-3 h-3 text-emerald-400" />}
                        {item.type === "model" && <TrendingUp className="w-3 h-3 text-cyan-400" />}
                        <p className="text-sm font-black text-white group-hover:text-violet-400 transition-colors">
                          {item.tag}
                        </p>
                      </div>
                      <p className="text-[10px] text-zinc-700 mt-0.5">
                        {item.type === "category" ? "Prompt category" : item.type === "model" ? "AI model" : "Trending topic"}
                        {item.count > 0 && ` · ${item.count} ${item.count === 1 ? "post" : "posts"}`}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-violet-400 transition-all group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ── SEARCH RESULTS ── */
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {totalResults === 0 && !isPending && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <SearchIcon className="w-10 h-10 text-zinc-700 mb-4" />
                <p className="text-[11px] font-black uppercase tracking-widest text-zinc-600">No results for "{query}"</p>
                <p className="text-[10px] text-zinc-800 mt-2">Try a different keyword or hashtag</p>
              </div>
            )}

            {/* PEOPLE */}
            {(activeTab === "all" || activeTab === "people") && results.users.length > 0 && (
              <section className="space-y-4">
                <SectionHeader icon={<User className="w-4 h-4 text-violet-400" />} label="People" count={results.users.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.users.map((u) => (
                    <Link
                      key={u.id}
                      href={`/u/${u.username}`}
                      className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-[#111118] overflow-hidden flex-shrink-0 relative border border-white/5">
                        {u.avatarUrl || u.image ? (
                          <Image src={u.avatarUrl || u.image} alt={u.name || ""} fill className="object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-zinc-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors truncate">{u.name}</p>
                          {u.professionalStatus === "VERIFIED" && (
                            <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-widest flex-shrink-0">Verified</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 truncate">@{u.username}</p>
                        {u.bio && <p className="text-[10px] text-zinc-700 truncate mt-0.5">{u.bio}</p>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-white transition-all group-hover:translate-x-1 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* PROMPTS */}
            {(activeTab === "all" || activeTab === "prompts") && results.prompts.length > 0 && (
              <section className="space-y-4">
                <SectionHeader icon={<ShoppingBag className="w-4 h-4 text-emerald-400" />} label="Prompts" count={results.prompts.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.prompts.map((p) => (
                    <PromptCard
                      key={p.id}
                      id={p.id}
                      title={p.title}
                      thumbnail={p.thumbnailUrl || "/marketplace/placeholder.png"}
                      model={p.aiModel || "GPT-4"}
                      price={`${p.currency === "INR" ? "₹" : "$"}${p.price}`}
                      prompt={p.previewContent || p.description}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* POSTS */}
            {(activeTab === "all" || activeTab === "posts") && results.posts.length > 0 && (
              <section className="space-y-4">
                <SectionHeader icon={<FileText className="w-4 h-4 text-cyan-400" />} label="Posts" count={results.posts.length} />
                <div className="space-y-3">
                  {results.posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-5 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#111118] overflow-hidden relative border border-white/5 flex-shrink-0">
                          {post.author?.avatarUrl ? (
                            <Image src={post.author.avatarUrl} alt={post.author.name || ""} fill className="object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-zinc-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-white">{post.author?.name}</p>
                          <p className="text-[10px] text-zinc-600">@{post.author?.username}</p>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {post.content.split(/(#\w+)/g).map((part: string, i: number) =>
                          part.startsWith("#") ? (
                            <button
                              key={i}
                              onClick={() => handleSearch(part.replace("#", ""))}
                              className="text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              {part}
                            </button>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </p>
                      <p className="text-[10px] text-zinc-700">
                        {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">{label}</h3>
      </div>
      <span className="text-[9px] font-bold text-zinc-700">{count} result{count !== 1 ? "s" : ""}</span>
    </div>
  );
}
