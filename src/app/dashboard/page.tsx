import RightPanel from "@/components/RightPanel";

export default function Dashboard() {
  const clusters = [
    { title: "LLM Context Window Efficiencies", score: 8400, trend: "+12%" },
    { title: "Vector Database Throughput", score: 6200, trend: "+5%" },
    { title: "Autonomous Agent Guardrails", score: 5100, trend: "-2%" },
    { title: "Multimodal Token Cost Optimization", score: 3900, trend: "+24%" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto flex gap-10">
      <div className="flex-1 space-y-8">
        <section className="grid grid-cols-2 gap-6">
          <div className="terminal-panel p-8 rounded-lg space-y-4">
            <h3 className="text-[10px] font-black tracking-widest text-gray-500 uppercase italic">Signal Density (24h)</h3>
            <div className="h-40 flex items-end gap-2">
              {[40, 60, 30, 80, 50, 90, 70, 45, 65, 85].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-accent/20 border-t border-accent/40 rounded-t transition-all hover:bg-accent/40" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-mono text-gray-600">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:59</span>
            </div>
          </div>

          <div className="terminal-panel p-8 rounded-lg space-y-6">
            <h3 className="text-[10px] font-black tracking-widest text-gray-500 uppercase italic">Active Nodes</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">US-EAST-1</span>
                <span className="text-[10px] font-mono text-green-500">ACTIVE [98%]</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[98%]" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">EU-WEST-2</span>
                <span className="text-[10px] font-mono text-green-500">ACTIVE [84%]</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[84%]" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase italic tracking-widest px-4 border-l-2 border-secondary">Cluster Intelligence</h2>
          <div className="grid grid-cols-1 gap-4">
            {clusters.map((cluster, i) => (
              <div key={i} className="terminal-panel p-6 rounded-lg flex items-center justify-between hover:border-accent/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded border border-white/5 flex items-center justify-center font-mono text-xs text-gray-500">
                    0{i+1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors">{cluster.title}</h4>
                    <p className="text-[10px] font-mono text-gray-500 uppercase mt-1">Unified priority index</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <p className="text-xs font-black text-white italic">{cluster.score.toLocaleString()}</p>
                    <p className={cluster.trend.startsWith('+') ? 'text-[9px] font-mono text-accent' : 'text-[9px] font-mono text-red-500'}>
                      {cluster.trend}
                    </p>
                  </div>
                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <RightPanel />
    </div>
  );
}
