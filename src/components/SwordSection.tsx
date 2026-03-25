"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SwordGraphic from "./SwordGraphic";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function SwordSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Animation States (Gsap will modify these)
  const [anim, setAnim] = useState({
    bladeX: 0,
    bladeY: 0,
    rotationZ: 0,
    rotationY: 0,
    sheathX: 0,
    sheathY: 0,
    sheathOpacity: 1,
    textOpacity: 0,
    textBlur: 20,
    textScale: 0.95,
    swordRevealOpacity: 1 // For the initial together state
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const state = { ...anim };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             setAnim({ ...state });
          }
        }
      });

      // 1. UNSHEATH (0% - 70%)
      tl.to(state, {
        bladeX: 300,
        rotationZ: 8,
        rotationY: 15,
        ease: "none",
        duration: 0.7
      }, 0);

      // 2. SHEATH MOVES AWAY (20% - 50%)
      tl.to(state, {
        sheathX: -350,
        sheathY: 120,
        sheathOpacity: 0,
        ease: "none",
        duration: 0.3
      }, 0.2);

      // 3. TEXT REVEAL (30% - 80%)
      tl.to(state, {
        textOpacity: 1,
        textBlur: 0,
        textScale: 1,
        ease: "none",
        duration: 0.5
      }, 0.3);

      // 4. FINAL SETTLE (70% - 100%)
      tl.to(state, {
        rotationZ: 0,
        rotationY: 0,
        bladeY: -40,
        ease: "sine.inOut",
        duration: 0.3
      }, 0.7);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#0a0f14] overflow-hidden">
      {/* TRIGGER / VIEWPORT SECTION */}
      <div ref={triggerRef} className="w-full h-screen flex flex-col items-center justify-center relative">
        
        {/* BIG BACK TEXT */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-0"
          style={{ 
            opacity: anim.textOpacity, 
            filter: `blur(${anim.textBlur}px)`,
            transform: `scale(${anim.textScale})`
          }}
        >
          <h1 className="text-[120px] md:text-[200px] font-black italic tracking-tighter text-white/10 leading-none">
            ZOLVEX
          </h1>
          <p className="text-[10px] md:text-sm font-black text-cyan-500/20 uppercase tracking-[0.5em] mt-4">
             Unlock precision analytics
          </p>
        </div>

        {/* SWORD GRAPHIC CONTAINER */}
        <div className="relative z-10 w-full flex items-center justify-center max-w-7xl mx-auto px-4 translate-x-12 md:translate-x-0">
          <SwordGraphic 
            className="w-full"
            bladeX={anim.bladeX}
            bladeY={anim.bladeY}
            rotationZ={anim.rotationZ}
            rotationY={anim.rotationY}
            sheathX={anim.sheathX}
            sheathY={anim.sheathY}
            sheathOpacity={anim.sheathOpacity}
            glowOpacity={anim.textOpacity} // Subtle specular sync
          />
        </div>

        {/* SCROLL GUIDE */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.3 - anim.textOpacity * 0.3 }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Slide to reveal</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-zinc-500 to-transparent" />
        </motion.div>
      </div>

      <style jsx global>{`
        /* Minimalist cleanup */
        body {
          scrollbar-width: thin;
          scrollbar-color: #1f2937 #0a0f14;
        }
      `}</style>
    </div>
  );
}
