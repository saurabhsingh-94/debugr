"use client";

import { MoreHorizontal, ExternalLink, Circle } from "lucide-react";

const DATA = [
  { id: "SIG-882", title: "Recursive Agent Loop in GPT-4o", priority: 9.4, user: "Saurabh S.", date: "Oct 24, 2026", status: "Active", color: "#ef4444" },
  { id: "SIG-741", title: "Token Hallucination in JSON Parser", priority: 6.2, user: "Alex M.", date: "Oct 23, 2026", status: "Resolved", color: "#22c55e" },
  { id: "SIG-612", title: "Vector DB Latency Spike (A-1)", priority: 8.5, user: "Sarah K.", date: "Oct 22, 2026", status: "Pending", color: "#facc15" },
  { id: "SIG-559", title: "Ouroboros Prompt Injection Flow", priority: 7.8, user: "DevOps J", date: "Oct 21, 2026", status: "Active", color: "#ef4444" },
  { id: "SIG-442", title: "Whisper V3 Silence Hallucination", priority: 4.1, user: "Root", date: "Oct 20, 2026", status: "Resolved", color: "#22c55e" },
];

export default function DataTable() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-8 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activity Signals</h3>
        <button className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
          View All <ExternalLink className="w-3 h-3" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-zinc-900/30">
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Signal ID</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Title</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Priority</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((row) => (
              <tr key={row.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.01] transition-all group">
                <td className="px-8 py-5 text-xs font-mono font-bold text-zinc-400">{row.id}</td>
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{row.title}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-zinc-800 border border-border rounded-md text-[11px] font-bold text-white font-mono">
                      {row.priority}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-border flex items-center justify-center">
                        <span className="text-[9px] font-bold text-zinc-500">{row.user.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-medium text-zinc-300">{row.user}</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-xs font-medium text-zinc-500">{row.date}</td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2">
                      <Circle className="w-2 h-2" style={{ fill: row.color, color: row.color }} />
                      <span className="text-xs font-bold text-white tracking-tight">{row.status}</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
