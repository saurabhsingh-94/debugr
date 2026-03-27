"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Zap, 
  Settings, 
  LayoutDashboard,
  ShieldCheck,
  User,
  Power,
  Search,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

const menuItems = [
  { id: "feed", icon: Zap, path: "/", label: "Nexus" },
  { id: "intel", icon: LayoutDashboard, path: "/dashboard", label: "Intelligence" },
  { id: "market", icon: ShoppingBag, path: "/marketplace", label: "Market" },
  { id: "profile", icon: User, path: "/profile", label: "Agent Profile" },
  { id: "signals", icon: BarChart3, path: "/signals", label: "Diagnostics" },
  { id: "vault", icon: ShieldCheck, path: "/vault", label: "Sync Vault" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const hideSidebar = useCallback(() => {
    if (!isHovering) {
      setIsVisible(false);
    }
  }, [isHovering]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isVisible && !isHovering) {
      timeout = setTimeout(hideSidebar, 3000);
    }

    return () => clearTimeout(timeout);
  }, [isVisible, isHovering, hideSidebar]);

  return (
    <>
      {/* Ghost Trigger Zone */}
      {!isVisible && (
        <div 
          className="fixed left-0 top-0 bottom-0 w-8 z-[110] transition-colors hover:bg-white/[0.02]"
          onMouseEnter={() => setIsVisible(true)}
        />
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 25,
              opacity: { duration: 0.2 }
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="fixed left-0 top-0 bottom-0 w-[240px] z-[100] flex flex-col items-center py-16 bg-[#080808]/40 backdrop-blur-3xl border-r border-white/5 shadow-[24px_0_80px_rgba(0,0,0,0.5)]"
          >
            {/* Brand Protocol */}
            <Link href="/" className="mb-20">
              <h2 className="text-2xl font-serif text-white italic tracking-tighter leading-none">Debugr</h2>
            </Link>

            {/* Navigation Matrix */}
            <div className="flex-1 flex flex-col gap-8 w-full items-center">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link key={item.id} href={item.path} className="w-full flex justify-center group relative px-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "w-full flex items-center gap-4 px-6 py-3.5 rounded-full transition-all duration-500",
                        isActive 
                          ? "text-white bg-white/[0.05] shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10" 
                          : "text-zinc-500 hover:text-white hover:bg-white/[0.02]"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "stroke-[2.5]" : "stroke-[1.5]")} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                        {item.label}
                      </span>
                    </motion.div>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-glow"
                        className="absolute inset-0 bg-white blur-2xl opacity-5 -z-10"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* System Protocols Footer */}
            <div className="mt-auto flex flex-col items-center gap-8 w-full opacity-40 hover:opacity-100 transition-opacity duration-700">
               <button className="text-zinc-700 hover:text-white transition-colors duration-500">
                  <Search className="w-4 h-4" />
               </button>
               <button className="text-zinc-700 hover:text-white transition-colors duration-500">
                  <Settings className="w-4 h-4" />
               </button>
               <div className="w-6 h-[1px] bg-white/[0.05]" />
               <button className="text-zinc-800 hover:text-red-500 transition-colors duration-500">
                  <Power className="w-4 h-4 text-zinc-900" />
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
