"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  Activity, 
  Layers, 
  MessageSquare, 
  Zap, 
  LifeBuoy,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Signals", icon: Activity, href: "/signals" },
  { label: "Clusters", icon: Layers, href: "/clusters" },
  { label: "Prompt Exchange", icon: MessageSquare, href: "/prompts" },
  { label: "Bounties", icon: Zap, href: "/bounties" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 fixed left-0 top-0 bottom-0 bg-sidebar border-r border-border flex flex-col z-50">
      <div className="p-8">
        <h1 className="text-xl font-black tracking-[0.2em] text-white">ZOLVEX</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-white/5 text-accent-cyan" 
                  : "text-zinc-500 hover:text-white hover:bg-white/[0.02]"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-accent-cyan" : "text-zinc-500")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-card/50 border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <LifeBuoy className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Support</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed mb-3">Need help with analytics? Contact our expert team.</p>
          <button className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-border rounded-lg text-[10px] font-bold text-white transition-all uppercase tracking-widest">
            Open Ticket
          </button>
        </div>

        <button className="flex items-center gap-3 p-2 w-full hover:bg-white/[0.02] rounded-xl transition-all group">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-border group-hover:border-zinc-700 transition-all">
            <UserCircle className="w-6 h-6 text-zinc-500" />
          </div>
          <div className="flex flex-col items-start truncate text-left">
            <span className="text-xs font-bold text-white truncate">Saurabh S.</span>
            <span className="text-[10px] text-zinc-600 truncate uppercase tracking-tighter">Pro Plan</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
