"use client";

import { useState } from "react";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  LayoutDashboard, 
  Activity, 
  Layers, 
  Zap, 
  BarChart3,
  User,
  Settings,
  LogOut,
  UserCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Signals", href: "/signals", icon: Activity },
  { label: "Clusters", href: "/clusters", icon: Layers },
  { label: "Bounties", href: "/bounties", icon: Zap },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function TopNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 px-8 py-6 z-50 pointer-events-none">
      <header className="h-16 w-full max-w-7xl mx-auto flex items-center justify-between px-6 rounded-2xl border border-white/10 bg-[#0a0f14]/80 backdrop-blur-xl shadow-2xl pointer-events-auto relative overflow-visible">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-green-400 to-blue-500" />
          </div>
          <span className="text-sm font-black tracking-[0.2em] text-white uppercase italic">ZOLVEX</span>
        </div>

        {/* CENTER: NAV PILLS */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all duration-300 relative",
                  isActive 
                    ? "text-white bg-white/10 shadow-lg ring-1 ring-white/10" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white shadow-[0_0_8px_white]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: CONTROLS */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-500 rounded-full border border-black" />
            </button>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 group p-1 pr-3 rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-white/30 transition-all">
                <UserCircle className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-all", isProfileOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Backdrop for closing */}
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 5 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute right-0 top-full mt-2 w-60 bg-[#111827] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-[100]"
                  >
                    <div className="p-4 bg-white/5 border-b border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-bold text-white truncate leading-none mb-1">Saurabh S.</span>
                          <span className="text-xs text-zinc-500 truncate font-mono">@curator_root</span>
                        </div>
                      </div>
                      <Link href="/profile" className="block w-full text-center py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-bold text-white transition-all uppercase tracking-widest">
                        View Profile
                      </Link>
                    </div>

                    <div className="p-2">
                       {[
                         { label: "Dashboard", icon: LayoutDashboard },
                         { label: "Manage Signals", icon: Activity },
                         { label: "Settings", icon: Settings },
                       ].map((item) => (
                         <button 
                           key={item.label}
                           className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-all group/item"
                         >
                           <item.icon className="w-4 h-4 text-zinc-600 group-hover/item:text-accent-cyan transition-colors" />
                           {item.label}
                         </button>
                       ))}
                    </div>

                    <div className="p-2 border-t border-white/10">
                       <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 rounded-xl text-xs font-medium text-zinc-500 hover:text-red-400 transition-all group/item">
                         <LogOut className="w-4 h-4 text-zinc-800 group-hover/item:text-red-500 transition-colors" />
                         Sign out
                       </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </div>
  );
}
