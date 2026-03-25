"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  UserCircle,
  Activity,
  BarChart3,
  User,
  Code2,
  Zap,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MENU_ITEMS = [
  { id: "trending", label: "TRENDING", icon: Activity, href: "/" },
  { id: "all", label: "ALL", icon: BarChart3, href: "/all" },
  { id: "my", label: "MY_SIGNALS", icon: User, href: "/my" },
  { id: "marketplace", label: "EXCHANGE", icon: Code2, href: "/marketplace" },
  { id: "bounties", label: "BOUNTIES", icon: Zap, href: "/bounties" },
];

export default function TopHeader() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 px-6 py-4 z-50 pointer-events-none">
      <header className="h-14 max-w-7xl mx-auto bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between px-6 pointer-events-auto shadow-2xl ring-1 ring-white/5">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group pointer-events-auto">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all shadow-[0_0_20px_rgba(255,255,255,0.03)]"
            >
              <Terminal className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-[0.3em] uppercase italic text-white/90 leading-none">DEBUGR</span>
              <span className="text-[7px] font-bold tracking-[0.4em] uppercase text-zinc-600 mt-1">AI_PROBLEM_INTEL</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2 pointer-events-auto">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "px-5 py-2 rounded-2xl text-[10px] font-bold tracking-[0.2em] transition-all duration-500 ease-out",
                    isActive 
                      ? "text-white bg-white/10 shadow-inner ring-1 ring-white/20 backdrop-blur-md" 
                      : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
              <SlidersHorizontal className="w-3 h-3" />
              SORT
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
              <Filter className="w-3 h-3" />
              FILTER
            </button>
          </div>
          
          <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />
          
          <button className="flex items-center gap-3 group">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[9px] font-bold text-white/80 tracking-tight">CURATOR_ROOT</span>
              <span className="text-[8px] font-medium text-zinc-600 tracking-widest">v1.2.4</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <UserCircle className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors relative z-10" />
            </div>
          </button>
        </div>
      </header>
    </div>
  );
}
