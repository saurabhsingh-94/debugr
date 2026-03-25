"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwordGraphicProps {
  className?: string;
  bladeY?: number | string;
  sheathY?: number | string;
  sheathRotate?: number;
  sheathOpacity?: number;
  glowOpacity?: number;
}

export default function SwordGraphic({
  className,
  bladeY = 0,
  sheathY = 0,
  sheathRotate = 0,
  sheathOpacity = 1,
  glowOpacity = 0,
}: SwordGraphicProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* SHADOW / GLOW FLOOR */}
      <div 
        className="absolute bottom-[-10%] w-[150%] h-[20%] bg-cyan-500/10 blur-[100px] rounded-full transition-opacity duration-700"
        style={{ opacity: glowOpacity * 0.5 }}
      />

      <div className="relative w-full h-full flex items-center justify-center">
        {/* THE BLADE */}
        <motion.div 
          style={{ y: bladeY }}
          className="absolute z-20 flex flex-col items-center"
        >
          {/* Hilt / Handle */}
          <div className="w-10 h-32 md:w-12 md:h-40 bg-zinc-900 border-x-2 border-t-2 border-zinc-700 rounded-t-lg relative">
             <div className="absolute inset-x-0 top-1/4 h-1 bg-zinc-800" />
             <div className="absolute inset-x-0 top-1/2 h-1 bg-zinc-800" />
             <div className="absolute inset-x-0 top-3/4 h-1 bg-zinc-800" />
             {/* Pommel */}
             <div className="absolute top-0 -translate-y-full w-14 md:w-16 h-4 bg-zinc-800 border-2 border-zinc-700 rounded-sm left-1/2 -translateX-1/2" style={{ left: '50%', transform: 'translateX(-50%) translateY(-100%)' }} />
          </div>

          {/* Crossguard */}
          <div className="w-28 md:w-36 h-4 md:h-6 bg-zinc-800 border-2 border-zinc-700 rounded-sm relative -mt-1 shadow-2xl">
              <div className="absolute inset-y-0 left-1/4 w-px bg-zinc-700" />
              <div className="absolute inset-y-0 right-1/4 w-px bg-zinc-700" />
          </div>

          {/* Blade Body */}
          <div className="w-12 md:w-16 h-[400px] md:h-[550px] bg-gradient-to-b from-zinc-700 via-zinc-400 to-zinc-800 relative clip-sword shadow-[0_0_40px_rgba(0,0,0,0.5)]">
             {/* Central Fuller */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-10 w-1.5 md:w-2 bg-black/30" />
             
             {/* Edge Glow */}
             <motion.div 
               style={{ opacity: glowOpacity }}
               className="absolute inset-0 border-x-[3px] border-cyan-400/60 blur-[2px] pointer-events-none"
             />
             <motion.div 
               style={{ opacity: glowOpacity }}
               className="absolute inset-0 bg-cyan-400/10 blur-[20px] pointer-events-none"
             />
          </div>
        </motion.div>

        {/* THE SHEATH */}
        <motion.div 
          style={{ 
            y: sheathY, 
            rotate: sheathRotate,
            opacity: sheathOpacity 
          }}
          className="absolute z-30 flex flex-col items-center"
        >
          {/* Sheath Body (Covers the blade initially) */}
          <div className="w-16 md:w-20 h-[420px] md:h-[570px] bg-[#0c1218] border-2 border-zinc-800/50 rounded-b-3xl relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
             {/* Decorative Elements */}
             <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-zinc-800 to-transparent opacity-20" />
             <div className="absolute inset-x-0 bottom-10 h-1 bg-zinc-800/30" />
             
             {/* Embossed Logo / Pattern */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
                <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">ZX</span>
             </div>

             {/* Metallic Rims */}
             <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-zinc-700 to-transparent" />
             <div className="absolute inset-x-0 bottom-0 h-8 bg-zinc-900 flex items-center justify-center">
                <div className="w-4 h-1 bg-zinc-800 rounded-full" />
             </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .clip-sword {
          clip-path: polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%);
        }
      `}</style>
    </div>
  );
}
