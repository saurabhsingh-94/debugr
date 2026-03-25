"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Activity, 
  User, 
  Code2, 
  Zap, 
  Cpu,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


const MENU_ITEMS = [
  { id: "trending", label: "Trending Signals", icon: Activity, href: "/" },
  { id: "all", label: "All Signals", icon: BarChart3, href: "/all" },
  { id: "my", label: "My Signals", icon: User, href: "/my" },
  { id: "marketplace", label: "Prompt Exchange", icon: Code2, href: "/marketplace" },
  { id: "bounties", label: "Bounties", icon: Zap, href: "/bounties" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-panel border-r border-white/5 flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Terminal className="w-5 h-5 text-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
            DEBUGR
          </h1>
        </div>
        <p className="text-[10px] font-mono text-secondary tracking-widest uppercase opacity-80">
          Terminal Curator v1.0
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative overflow-hidden",
                isActive 
                  ? "text-accent bg-accent/5 border border-accent/10 shadow-[0_0_15px_rgba(34,211,238,0.05)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-accent shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
              <item.icon className={cn(
                "w-4 h-4 transition-colors",
                isActive ? "text-accent" : "text-gray-500 group-hover:text-white"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 text-[10px] font-mono">
          <span className="text-gray-500 uppercase tracking-tighter">System Status</span>
          <div className="flex items-center gap-1.5 text-green-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>NODES ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
