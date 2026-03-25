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
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] uppercase italic text-white/90">DEBUGR</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-[0.15em] transition-all duration-300",
                    isActive 
                      ? "text-white bg-white/10 shadow-inner ring-1 ring-white/10" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
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
