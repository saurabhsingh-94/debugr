"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import NeonSidebar from "@/components/NeonSidebar";
import FloatingPostButton from "@/components/FloatingPostButton";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      <NeonSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen pl-0 lg:pl-[260px]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 lg:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
          <Footer />
        </div>
      </main>

      <FloatingPostButton />
    </div>
  );
}
