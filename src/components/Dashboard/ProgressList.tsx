"use client";

const REGIONS = [
  { name: "North America", value: 45, color: "#22d3ee" },
  { name: "Europe", value: 32, color: "#8b5cf6" },
  { name: "Asia Pacific", value: 18, color: "#22c55e" },
  { name: "Others", value: 5, color: "#f4f4f5" },
];

export default function ProgressList() {
  return (
    <div className="bg-card border border-border p-8 rounded-2xl h-full flex flex-col">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-8">Regional Pulse</h3>
      <div className="space-y-8 flex-1">
        {REGIONS.map((region) => (
          <div key={region.name} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-zinc-300 tracking-tight">{region.name}</span>
              <span className="text-xs font-mono font-bold text-white">{region.value}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${region.value}%`, backgroundColor: region.color }} 
              />
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 border border-border rounded-xl text-[10px] font-bold text-white transition-all uppercase tracking-[0.2em]">
        View Detailed Report
      </button>
    </div>
  );
}
