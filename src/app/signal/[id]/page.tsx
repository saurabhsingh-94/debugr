import SignalCard from "@/components/SignalCard";
import RightPanel from "@/components/RightPanel";

export default function SignalDetail({ params }: { params: { id: string } }) {
  // Mock data for detail page
  const signal = {
    id: params.id,
    title: "GPT-4 Context Window 'Memory Leak' in Long-Form Reasoning",
    description: "Detailed analysis of the degradation in output consistency after 32k tokens. This issue affects recursive reasoning tasks where the model loses track of initial constraints. It appears to be linked to how the context is managed during long sessions.",
    tags: ["AI", "LLM", "ARCHITECTURE"],
    votes: 412,
    painScore: 8.5,
    mergedFrom: 12,
    commentCount: 84
  };

  return (
    <div className="max-w-[1200px] mx-auto flex gap-10">
      <div className="flex-1 space-y-8">
        <div className="terminal-panel rounded-lg p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-accent uppercase tracking-widest">Signal Trace ID: {signal.id}</span>
              <span className="h-[1px] flex-1 bg-white/5" />
            </div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              {signal.title}
            </h1>
          </div>

          <div className="flex gap-4">
            {signal.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-accent/5 border border-accent/20 rounded text-[10px] font-bold text-accent uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed text-lg italic">
              {signal.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Priority Index</p>
              <p className="text-2xl font-black text-white">{(signal.votes * signal.painScore).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Pain Density</p>
              <p className="text-2xl font-black text-accent">{signal.painScore}/10</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Verification Nodes</p>
              <p className="text-2xl font-black text-secondary">{signal.mergedFrom}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase italic tracking-widest px-4 border-l-2 border-accent">Recent Timeline</h2>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="terminal-panel p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent/40" />
                  <p className="text-sm text-gray-400">Node analysis update received from <span className="text-white">@agent_0{i}</span></p>
                </div>
                <span className="text-[10px] font-mono text-gray-600">-{i * 12}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <RightPanel />
    </div>
  );
}
