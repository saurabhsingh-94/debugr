"use client";

import { useState } from "react";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Home,
  LayoutDashboard, 
  Activity, 
  Layers, 
  Zap, 
  MessageSquare,
  BarChart3,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Signals", href: "/signals", icon: Activity },
  { label: "Clusters", href: "/clusters", icon: Layers },
  { label: "Exchange", href: "/exchange", icon: MessageSquare },
  { label: "Bounties", href: "/bounties", icon: Zap },
];

export default function TopNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 px-4 md:px-8 py-4 md:py-6 z-50 pointer-events-none">
      <header className="h-16 w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 rounded-2xl border border-white/10 bg-[#0a0f14]/90 backdrop-blur-xl shadow-2xl pointer-events-auto relative">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3 min-w-[100px] md:min-w-[140px]">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:border-cyan-500/30 transition-all">
              <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600" />
            </div>
            <span className="hidden sm:block text-sm font-black tracking-[0.2em] text-white uppercase italic">ZOLVEX</span>
          </Link>
        </div>

        {/* CENTER: CONSOLIDATED NAV (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 shadow-inner">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300 relative flex items-center gap-2",
                  isActive 
                    ? "text-white bg-white/10 shadow-md ring-1 ring-white/10" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                )}
              >
                <item.icon className={cn("w-3.5 h-3.5", isActive ? "text-cyan-400" : "text-zinc-600")} />
                <span className="hidden lg:block">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow-indicator"
                    className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-3 h-[1.5px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: CONTROLS */}
        <div className="flex items-center gap-2 md:gap-4 min-w-[100px] md:min-w-[140px] justify-end">
          <div className="hidden sm:flex items-center gap-1">
            <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-cyan-500 rounded-full border-[1.5px] border-[#0a0f14]" />
            </button>
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/10" />

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 group p-0.5 rounded-full hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-cyan-500/50">
                <UserCircle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300" />
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-[220px] bg-[#111827] rounded-xl shadow-xl border border-white/10 overflow-hidden z-[100]"
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                           <UserCircle className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-bold text-white truncate leading-tight">Saurabh S.</span>
                          <span className="text-[10px] text-zinc-500 truncate font-mono">@curator_root</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-1">
                       <Link 
                         href="/profile" 
                         className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all group/item"
                         onClick={() => setIsProfileOpen(false)}
                       >
                         <UserCircle className="w-4 h-4 text-zinc-600 group-hover/item:text-cyan-400 transition-colors" />
                         View Profile
                       </Link>
                       {[
                         { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                         { label: "Settings", href: "/settings", icon: Settings },
                       ].map((item) => (
                         <Link 
                           key={item.label}
                           href={item.href}
                           className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all group/item"
                           onClick={() => setIsProfileOpen(false)}
                         >
                           <item.icon className="w-4 h-4 text-zinc-600 group-hover/item:text-cyan-400 transition-colors" />
                           {item.label}
                         </Link>
                       ))}
                    </div>

                    <div className="p-1 border-t border-white/10">
                       <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg text-xs font-medium text-zinc-500 hover:text-red-400 transition-all group/item">
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

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0a0f14] border-r border-white/10 p-6 pt-24 z-[-1] md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                 <div className="space-y-2">
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] px-4">Navigation</h3>
                   <div className="space-y-1">
                      {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                              isActive
                                ? "bg-white/5 text-white ring-1 ring-white/10"
                                : "text-zinc-500 hover:text-white hover:bg-white/[0.02]"
                            )}
                          >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-cyan-400" : "text-zinc-700")} />
                            <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                          </Link>
                        );
                      })}
                   </div>
                 </div>

                 <div className="space-y-2 pt-6 border-t border-white/5">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] px-4">Account</h3>
                    <div className="space-y-1">
                       {[
                         { label: "Search", icon: Search },
                         { label: "Notifications", icon: Bell },
                         { label: "Settings", icon: Settings },
                       ].map((item) => (
                         <button
                           key={item.label}
                           className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.02] transition-all"
                         >
                           <item.icon className="w-5 h-5 text-zinc-700" />
                           <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Bottom User Card in Menu */}
                 <div className="mt-10 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-zinc-500" />
                       </div>
                       <div className="flex flex-col truncate">
                          <span className="text-xs font-black text-white px-1">Saurabh S.</span>
                          <span className="text-[9px] text-zinc-600 font-mono tracking-tighter">@curator_root</span>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
