"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("CRITICAL_CLIENT_EXCEPTION:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
        <div className="relative w-20 h-20 rounded-3xl bg-black/40 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
      </div>
      
      <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Protocol_Interrupted</h2>
      <p className="text-zinc-500 text-sm max-w-md mb-10 leading-relaxed font-medium">
        A critical diagnostic exception occurred in the client-side runtime. The neural connection has been temporarily severed.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Attempt Re-Link
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all"
        >
          <Home className="w-4 h-4" />
          Emergency Return
        </Link>
      </div>

      <div className="mt-16 p-4 rounded-xl bg-red-500/5 border border-red-500/10 max-w-2xl overflow-hidden">
         <p className="text-[10px] font-mono text-red-400/60 break-all">
           {error.message || "Unknown cryptographic fault detected."}
         </p>
         {error.digest && (
           <p className="text-[9px] font-mono text-zinc-800 mt-2 uppercase tracking-widest">
             Digest: {error.digest}
           </p>
         )}
      </div>
    </div>
  );
}
