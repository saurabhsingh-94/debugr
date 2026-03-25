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
    <header className="h-16 fixed top-0 right-0 left-0 bg-background/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 lg:px-10 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Terminal className="w-5 h-5 text-white" />
          <span className="text-lg font-black tracking-tighter uppercase italic">DEBUGR</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-widest transition-all",
                  isActive 
                    ? "text-white bg-white/10" 
                    : "text-zinc-500 hover:text-white"
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
          <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/5 text-[10px] font-bold text-zinc-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
            <SlidersHorizontal className="w-3 h-3" />
            SORT
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/5 text-[10px] font-bold text-zinc-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
            <Filter className="w-3 h-3" />
            FILTER
          </button>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10 mx-2 hidden sm:block" />
        
        <button className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-tighter hidden sm:block font-bold">ROOT_LOGIN</span>
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
            <UserCircle className="w-5 h-5" />
          </div>
        </button>
      </div>
    </header>
  );
}
