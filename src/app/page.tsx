import ScrollIntroduction from "@/components/ScrollIntroduction";
import SignalCard from "@/components/SignalCard";

const MOCK_SIGNALS = [
  {
    id: "1",
    title: "GPT-4 Context Window 'Memory Leak' in Long-Form Reasoning",
    description: "Users report significant degradation in output consistency after 32k tokens in recursive reasoning tasks.",
    tags: ["AI", "LLM", "ARCHITECTURE"],
    votes: 412,
    painScore: 8.5,
    mergedFrom: 12,
    commentCount: 84
  },
  {
    id: "2",
    title: "Inconsistent Type Generation in TypeScript Codegen Flows",
    description: "Codegen consistently hallucinates nested interface structures when dealing with complex GraphQL schemas.",
    tags: ["CODING", "TYPESCRIPT"],
    votes: 1200,
    painScore: 6.2,
    mergedFrom: 5,
    commentCount: 152
  },
  {
    id: "3",
    title: "Vector DB Latency Spikes during High-Concurrency Retrieval",
    description: "Observed 2000ms+ latency when performing k-NN searches during peak traffic.",
    tags: ["DATABASE", "VECTOR-SEARCH"],
    votes: 892,
    painScore: 9.4,
    isUnique: true,
    commentCount: 210
  }
];

export default function Home() {
  return (
    <div className="relative">
      {/* 1. CINEMATIC SCROLL INTRO */}
      <ScrollIntroduction />

      {/* 2. MAIN FEED CONTENT */}
      <div className="relative z-10 px-4 md:px-0 max-w-4xl mx-auto pt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase">ACTIVE_THREADS</h2>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#22d3ee]" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Monitoring live autonomous flows</span>
            </div>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 shadow-inner">
            <button className="px-5 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase text-white bg-white/10 shadow-md ring-1 ring-white/10">HOT</button>
            <button className="px-5 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition-colors">NEW</button>
            <button className="px-5 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition-colors">TOP</button>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8 pb-32">
          {MOCK_SIGNALS.map((signal) => (
            <SignalCard key={signal.id} {...signal} />
          ))}
          
          <div className="py-20 flex flex-col items-center gap-6">
            <div className="w-12 h-[1px] bg-white/10" />
            <button className="group flex items-center gap-4 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all duration-500 hover:border-cyan-500/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="text-[10px] font-black text-zinc-500 group-hover:text-white uppercase tracking-[0.4em] transition-colors relative z-10">Decrypt More Signals</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
