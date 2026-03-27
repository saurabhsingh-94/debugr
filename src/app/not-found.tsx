import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase italic">404 Not Found</h1>
      <p className="text-zinc-500 font-mono text-sm max-w-xs leading-relaxed">
        The signal you are looking for has been purged or never existed.
      </p>
      <a 
        href="/" 
        className="mt-10 px-6 py-2 border border-white/10 rounded-xl text-[10px] font-bold tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </a>
    </div>
  );
}
