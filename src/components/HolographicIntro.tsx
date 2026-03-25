"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function HolographicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  
  const [displayText, setDisplayText] = useState("0010110");
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=2500",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             const p = self.progress;
             if (p < 0.2) setPhase(0);
             else if (p < 0.5) setPhase(1);
             else if (p < 0.8) setPhase(2);
             else setPhase(3);
             
             // Simple decryption effect simulation
             if (p > 0.1 && p < 0.4) {
                const chars = "ZOLVEX0123456789";
                setDisplayText(Array(6).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(""));
             } else if (p >= 0.4) {
                setDisplayText("ZOLVEX");
             }
          }
        }
      });

      // 1. THE BIT (Initial point) -> CORE EXPANSION
      tl.to(".digital-core", {
        scale: 4,
        rotate: 180,
        opacity: 1,
        borderRadius: "20%",
        duration: 1
      }, 0);

      // 2. GRID / WIREFRAME REVEAL
      tl.to(".holographic-grid", {
        opacity: 0.15,
        scale: 1,
        duration: 1
      }, 0.2);

      // 3. TEXT REVEAL & SHARPEN
      tl.to(".brand-text", {
        opacity: 1,
        filter: "blur(0px)",
        letterSpacing: "0.2em",
        duration: 1
      }, 0.3);

      // 4. FRAGMENTS ORBIT
      tl.to(".data-fragment", {
        x: (i) => (i % 2 === 0 ? 200 : -200),
        y: (i) => (i % 3 === 0 ? 100 : -100),
        opacity: 0.3,
        duration: 0.8,
        stagger: 0.1
      }, 0.4);

      // 5. ACTIVATION BURST (Expand to background)
      tl.to(".digital-core", {
        scale: 15,
        opacity: 0.1,
        filter: "blur(100px)",
        duration: 1.5,
        ease: "power2.inOut"
      }, 0.7);

      tl.to(".intro-overlay", {
        backgroundColor: "rgba(10, 15, 20, 0)",
        duration: 1
      }, 0.8);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#0a0f14] overflow-hidden">
      <div ref={triggerRef} className="w-full h-screen flex flex-col items-center justify-center relative intro-overlay bg-[#0a0f14]">
        
        {/* HOLOGRAPHIC GRID BACKGROUND */}
        <div className="holographic-grid absolute inset-0 opacity-0 scale-150 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]" />
          <div className="absolute inset-0" style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />
        </div>

        {/* DIGITAL CORE (Abstract Expanding Element) */}
        <div ref={coreRef} className="digital-core absolute w-20 h-20 border-[2px] border-cyan-400/50 shadow-[0_0_50px_rgba(34,211,238,0.3)] opacity-0 z-10 flex items-center justify-center overflow-hidden uppercase font-black text-[4px] text-cyan-400/20 tracking-tighter mix-blend-screen">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="whitespace-nowrap">SYSTEM_ACTIVATION_RECURSIVE_BOOT_SEQUENCE_LOADING_SIGNALS_DECRYPTING_ZOLVEX_CORE</div>
            ))}
        </div>

        {/* DATA FRAGMENTS (Orbiting nodes) */}
        {Array(12).fill(0).map((_, i) => (
          <div key={i} className="data-fragment absolute w-1 h-1 bg-cyan-400 opacity-0 z-5 shadow-[0_0_10px_#22d3ee]" />
        ))}

        {/* DECRYPTING BRAND TEXT */}
        <div className="relative z-20 flex flex-col items-center text-center">
          <h1 className="brand-text text-[100px] md:text-[180px] font-black italic tracking-[-0.1em] text-white opacity-0 blur-2xl transition-all duration-300">
            {displayText}
          </h1>
          
          <div className="mt-4 flex flex-col items-center gap-4">
            <motion.div 
               animate={phase >= 2 ? { width: 120, opacity: 1 } : { width: 0, opacity: 0 }}
               className="h-[1px] bg-cyan-500/50"
            />
            <p className="text-[10px] md:text-xs font-black text-cyan-500/40 uppercase tracking-[0.6em] h-4">
              {phase >= 2 ? "Universal Signal Intelligence" : ""}
            </p>
          </div>
        </div>

        {/* SCROLL ACTUATOR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500">Initiate System</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500 to-transparent animate-shimmer-y" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer-y {
          0% { transform: scaleY(0.5); opacity: 0.2; }
          50% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0.5); opacity: 0.2; }
        }
        .animate-shimmer-y {
          animation: shimmer-y 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
