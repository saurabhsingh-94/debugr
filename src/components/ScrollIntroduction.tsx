"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SwordGraphic from "./SwordGraphic";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const TAGLINES = [
  "Cut through complexity.",
  "Reveal real problems.",
  "Build what matters.",
];

export default function ScrollIntroduction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [activeTagline, setActiveTagline] = useState(0);
  
  // Sword States
  const [swordState, setSwordState] = useState({
    bladeY: 0,
    sheathY: 0,
    sheathRotate: 0,
    sheathOpacity: 1,
    glowOpacity: 0,
    scale: 1,
    blur: 0,
    bgOpacity: 0
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sword = { ...swordState };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=2500", // Adjusted scroll depth
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             // Tagline logic
             const p = self.progress;
             if (p < 0.25) setActiveTagline(0);
             else if (p < 0.5) setActiveTagline(1);
             else setActiveTagline(2);
             
             // Manually sync updated 'sword' object to state
             setSwordState({ ...sword });
          }
        }
      });

      // PHASE 1: Unsheathing
      tl.to(sword, {
        bladeY: -450,
        glowOpacity: 1,
        ease: "none",
        duration: 2
      });

      // PHASE 2: Sheath Drop
      tl.to(sword, {
        sheathY: 800,
        sheathRotate: 20,
        sheathOpacity: 0,
        ease: "power2.in",
        duration: 1.5
      }, "-=0.2");

      // PHASE 3: Transition to Background
      tl.to(sword, {
        scale: 1.8,
        bladeY: -100,
        blur: 40,
        bgOpacity: 0.1,
        glowOpacity: 0.5,
        duration: 1.5,
        ease: "power3.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#0a0f14] overflow-hidden">
      {/* TRIGGER SECTION */}
      <div ref={triggerRef} className="w-full h-screen flex flex-col items-center justify-center relative">
        
        {/* SWORD GRAPHIC */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" style={{ opacity: Math.max(0.1, 1 - swordState.bgOpacity * 5) }}>
          <SwordGraphic 
            className="w-[120px] md:w-[150px] lg:w-[180px]"
            bladeY={swordState.bladeY}
            sheathY={swordState.sheathY}
            sheathRotate={swordState.sheathRotate}
            sheathOpacity={swordState.sheathOpacity}
            glowOpacity={swordState.glowOpacity}
          />
        </div>

        {/* BACKGROUND VERSION (For persistent state) */}
        <div 
           className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
           style={{ 
             opacity: swordState.bgOpacity,
             filter: `blur(${swordState.blur}px)`,
             transform: `scale(${swordState.scale}) translateY(${swordState.bladeY * 0.2}px)`
           }}
        >
           <SwordGraphic 
            className="w-[120px] md:w-[150px] lg:w-[180px]"
            bladeY={-100}
            sheathOpacity={0}
            glowOpacity={0.8}
          />
        </div>

        {/* GSAP SELECTORS FOR SWORD GRAPHIC (Targeting internal motion.divs) */}
        <div className="hidden">
           <div className="blade-container" />
           <div className="sheath-container" />
           <div className="sword-glow" />
        </div>

        {/* OVERLAY TEXT */}
        <div className="z-20 flex flex-col items-center text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl md:text-9xl font-black italic tracking-tighter text-white mb-2 selection:bg-cyan-500/30"
          >
            ZOLVEX
          </motion.h1>

          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTagline}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-zinc-500 text-sm md:text-lg font-black uppercase tracking-[0.3em] font-mono"
              >
                {TAGLINES[activeTagline]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* SCROLL GUIDE */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Scroll to activate</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-cyan-500 to-transparent" />
        </motion.div>
      </div>

      {/* PORTAL TO MAIN CONTENT */}
      <div className="reveal-content opacity-0 translate-y-20 transition-all duration-1000">
         {/* This is just a placeholder to let the user know content starts here */}
      </div>

      <style jsx global>{`
        /* Sync GSAP selectors to SwordGraphic internal divs via manual class injection if needed, 
           or just target the motion.divs directly in SwordGraphic by passing refs. 
           For simplicity here, I'll pass the GSAP controls via SwordGraphic props. */
      `}</style>
    </div>
  );
}
