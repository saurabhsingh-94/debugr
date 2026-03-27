"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, ChevronRight, LogIn, User, ExternalLink, 
  PenSquare, X, Camera, Save, Loader2, Github, 
  Twitter, Instagram, MapPin, Link as LinkIcon, 
  Calendar, MoreHorizontal, Compass, ShoppingBag, 
  LayoutDashboard, Settings, Mail, Menu, PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Logo, label: "Home", href: "/", badge: null },
  { icon: Compass, label: "Explore", href: "/explore", badge: null },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", badge: null },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace", badge: "Live" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: null },
];

const systemItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function NeonSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = session?.user;
  const isLoading = status === "loading";

  const displayName = user?.name || "Anonymous User";
  const displayUsername = (user as any)?.username || "Anonymous";
  const avatarUrl = (user as any)?.avatarUrl || user?.image;

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 88 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col h-screen fixed left-0 top-0 bg-[#050505] border-r border-white/5 z-50 overflow-y-auto scrollbar-none"
      >
        
        {/* LOGO & TOGGLE */}
        <div className={cn("p-8 flex items-center justify-between", isCollapsed && "px-6")}>
          <Link href="/" className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            {!isCollapsed && <span className="text-xl font-black italic tracking-tighter text-white">Debugr</span>}
          </Link>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group relative flex items-center justify-center w-9 h-9 border border-white/10 rounded-xl bg-white/[0.03] hover:bg-white hover:text-black transition-all duration-500 shadow-xl overflow-hidden"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </motion.div>
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: isCollapsed ? 0 : 2 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group",
                    isActive ? "bg-white/[0.04] text-white" : "text-zinc-500 hover:text-white",
                    isCollapsed && "justify-center px-0 w-12 mx-auto"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-[13px] font-medium tracking-tight">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="ml-auto text-[8px] font-bold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          <div className="nn-divider my-6 opacity-30" />

          {!isCollapsed && <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest mb-2 px-4">Registry</p>}
          {systemItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                  isActive ? "bg-white/5 text-white shadow-2xl" : "text-zinc-600 hover:text-white",
                  isCollapsed && "justify-center px-0 w-12 mx-auto"
                )}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-[13px] font-medium tracking-tight">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 mb-8">
          {isLoading ? (
            <div className="flex items-center gap-3 p-4 bg-white/[0.01] rounded-[24px]">
              <div className="w-10 h-10 rounded-2xl bg-white/5 animate-spin" />
              {!isCollapsed && (
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-white/5 rounded animate-pulse" />
                  <div className="h-1.5 bg-white/5 rounded w-2/3 animate-pulse" />
                </div>
              )}
            </div>
          ) : user ? (
            <Link href="/profile">
              <div className={cn(
                "flex items-center gap-4 p-4 rounded-[24px] hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all cursor-pointer group",
                isCollapsed && "p-2 justify-center"
              )}>
                <div className="w-10 h-10 rounded-2xl overflow-hidden bg-violet-500/10 border border-white/10 flex-shrink-0 relative">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-zinc-800" />
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-white truncate uppercase tracking-tight">{displayName}</p>
                      <p className="text-[11px] font-bold text-zinc-700 truncate">@{displayUsername}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-violet-400 transition-colors" />
                  </>
                )}
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-[24px] bg-white hover:bg-zinc-200 text-black shadow-2xl transition-all cursor-pointer group",
                  isCollapsed && "p-2 justify-center"
                )}
              >
                <LogIn className="w-5 h-5" />
                {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em]">Sign In</span>}
              </motion.div>
            </Link>
          )}
        </div>
      </motion.aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="flex items-center justify-around px-2 py-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-violet-400" : "text-zinc-600"}`}>
                <item.icon className="w-6 h-6 px-1" />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label.slice(0, 4)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
