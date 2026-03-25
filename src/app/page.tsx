import SignalCard from "@/components/SignalCard";
import RightPanel from "@/components/RightPanel";
import FAB from "@/components/FAB";

const MOCK_SIGNALS = [
  {
    id: "1",
    title: "GPT-4 Context Window 'Memory Leak' in Long-Form Reasoning",
    description: "Users report significant degradation in output consistency after 32k tokens in recursive reasoning tasks. System appears to lose track of initial constraints despite high available RAM.",
    tags: ["AI", "LLM", "ARCHITECTURE"],
    votes: 412,
    painScore: 8.5,
    mergedFrom: 12,
    commentCount: 84
  },
  {
    id: "2",
    title: "Inconsistent Type Generation in TypeScript Codegen Flows",
    description: "Codegen consistently hallucinates nested interface structures when dealing with complex GraphQL schemas. Manual patching required for 40% of outputs.",
    tags: ["CODING", "TYPESCRIPT"],
    votes: 1200,
    painScore: 6.2,
    mergedFrom: 5,
    commentCount: 152
  },
  {
    id: "3",
    title: "Vector DB Latency Spikes during High-Concurrency Retrieval",
    description: "Observed 2000ms+ latency when performing k-NN searches during peak traffic. Indexing locks appear to block read operations in certain partition configurations.",
    tags: ["DATABASE", "VECTOR-SEARCH"],
    votes: 892,
    painScore: 9.4,
    isUnique: true,
    commentCount: 210
  },
  {
    id: "4",
    title: "Token-Efficient Multimodal Parsing for Legacy PDF Docs",
    description: "Current vision models are too expensive for bulk parsing of financial tables. Need a hybrid OCR/LLM approach that maintains spatial context without heavy imagery.",
    tags: ["VISION", "OPTIMIZATION"],
    votes: 56,
    painScore: 4.5,
    mergedFrom: 2,
    commentCount: 12
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto flex justify-center px-4">
      <div className="flex w-full gap-10">
        <div className="flex-1 max-w-3xl space-y-6">
          <div className="flex items-center justify-between pb-8">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">ACTIVE_THREADS</h2>
            <div className="h-px flex-1 bg-white/5 mx-6" />
          </div>
          
          {MOCK_SIGNALS.map((signal) => (
            <SignalCard key={signal.id} {...signal} />
          ))}
          
          {/* Empty state / footer spacer */}
          <div className="h-20" />
        </div>
        
        <div className="hidden xl:block w-80">
          <RightPanel />
        </div>
      </div>
      <FAB />
    </div>
  );
}
