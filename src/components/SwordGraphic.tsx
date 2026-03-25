"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwordGraphicProps {
  className?: string;
  bladeY?: number | string;
  bladeX?: number | string;
  sheathY?: number | string;
  sheathX?: number | string;
  sheathRotate?: number;
  sheathOpacity?: number;
  glowOpacity?: number;
  rotationY?: number;
  rotationZ?: number;
}

export default function SwordGraphic({
  className,
  bladeY = 0,
  bladeX = 0,
  sheathY = 0,
  sheathX = 0,
  sheathRotate = 0,
  sheathOpacity = 1,
  glowOpacity = 0,
  rotationY = 0,
  rotationZ = 0,
}: SwordGraphicProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="relative w-full h-[600px] flex items-center justify-center perspective-[1000px]">
        
        {/* THE BLADE (Katana) */}
        <motion.div 
          style={{ 
            x: bladeX, 
            y: bladeY,
            rotateZ: rotationZ,
            rotateY: rotationY,
            transformPerspective: 800
          }}
          className="absolute z-20 flex flex-nowrap items-center"
        >
          {/* Handle (Tsuka) - Matte Black, Precision Feel */}
          <div className="w-40 h-10 bg-zinc-950 border border-zinc-900 rounded-l-sm relative flex items-center justify-center shrink-0">
             <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-900/50" />
             <div className="w-[1px] h-6 bg-zinc-900 ml-4" />
             <div className="w-[1px] h-6 bg-zinc-900 ml-4" />
             <div className="w-[1px] h-6 bg-zinc-900 ml-4" />
          </div>

          {/* Guard (Tsuba) - Minimal Circular Matte Black */}
          <div className="w-1.5 h-16 bg-zinc-900 border-x border-zinc-800 shrink-0 relative z-30" />

          {/* Blade Body - Brushed Steel, Curved */}
          <div className="w-[450px] lg:w-[600px] h-9 bg-gradient-to-b from-zinc-600 via-zinc-400 to-zinc-700 relative clip-katana shadow-2xl shrink-0">
             {/* Edge Highlight - Precision Line */}
             <div className="absolute inset-x-0 bottom-0.5 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-white/20 blur-[0.5px]" />
             
             {/* Fuller - Subtle indent */}
             <div className="absolute inset-x-0 top-2 h-1 bg-black/10 blur-[1px]" />
             
             {/* Steel Texture Overlay */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-10 pointer-events-none" />

             {/* Dynamic Specular / Reflection */}
             <motion.div 
               style={{ opacity: glowOpacity * 0.3 }}
               className="absolute inset-0 bg-gradient-to-tr from-cyan-400/5 via-transparent to-transparent pointer-events-none"
             />
          </div>
        </motion.div>

        {/* THE SHEATH (Saya) */}
        <motion.div 
          style={{ 
            x: sheathX, 
            y: sheathY, 
            rotateZ: sheathRotate,
            opacity: sheathOpacity 
          }}
          className="absolute z-10 flex items-center"
        >
          {/* Sheath Body */}
          <div className="w-[480px] lg:w-[630px] h-12 bg-[#0c1218] border border-zinc-900 rounded-r-sm relative shadow-2xl flex items-center clip-sheath">
             {/* Rim Detail */}
             <div className="absolute left-0 top-0 bottom-0 w-3 bg-zinc-900 border-r border-zinc-800" />
             
             {/* Matte Finish Texture */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
             
             {/* Subtle Branding / Logo */}
             <div className="absolute left-20 opacity-10 flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm border border-white" />
                <span className="text-[10px] font-black tracking-[0.2em] italic text-white uppercase">PRECISION</span>
             </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .clip-katana {
          clip-path: polygon(0% 10%, 92% 10%, 100% 50%, 92% 90%, 0% 90%);
        }
        .clip-sheath {
          clip-path: polygon(0% 0%, 100% 5%, 100% 95%, 0% 100%);
        }
      `}</style>
    </div>
  );
}
