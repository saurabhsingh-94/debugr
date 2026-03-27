"use client";

import { motion } from "framer-motion";
import { 
  Users, Activity, TrendingUp, ArrowUpRight,
  Zap, Globe, MoreHorizontal, RefreshCw,
  ShieldCheck, AlertCircle, Clock
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, Tooltip
} from "recharts";

const performanceData = [
  { name: "Oct", value: 40 }, { name: "Nov", value: 55 },
  { name: "Dec", value: 38 }, { name: "Jan", value: 70 },
  { name: "Feb", value: 90 }, { name: "Mar", value: 85 }
];

const recentIssues = [
  { id: 1, title: "Memory leak in React useEffect", priority: "High", status: "Open", time: "2m ago", trust: "94%" },
  { id: 2, title: "API rate limiting on Supabase auth", priority: "Critical", status: "Investigating", time: "15m ago", trust: "87%" },
  { id: 3, title: "TypeScript inference failing on generics", priority: "Medium", status: "Resolved", time: "1h ago", trust: "72%" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0c0c18] border border-violet-500/20 rounded-xl px-3 py-2 text-xs shadow-lg">
        <p className="text-violet-300 font-medium">{label}</p>
        <p className="text-white font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400/80 tracking-widest uppercase">System Nominal</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1 text-sm">Your intelligence overview for today</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="nn-btn-ghost text-sm px-4 py-2 rounded-xl flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="nn-btn-primary text-sm px-4 py-2 rounded-xl">
            Export Logs
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Nodes", val: "72,840", icon: Users, change: "+12%", color: "text-violet-400", bgGlow: "from-violet-500/10" },
          { label: "Issues Solved", val: "1,240", icon: ShieldCheck, change: "+8%", color: "text-emerald-400", bgGlow: "from-emerald-500/10" },
          { label: "Avg Response", val: "1.4s", icon: Clock, change: "-0.2s", color: "text-cyan-400", bgGlow: "from-cyan-500/10" },
          { label: "Error Rate", val: "0.8%", icon: AlertCircle, change: "-0.3%", color: "text-rose-400", bgGlow: "from-rose-500/10" },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="nn-card p-5 relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-[11px] font-semibold text-emerald-400/80">{metric.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{metric.val}</p>
              <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wide">{metric.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHART + ISSUES */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* AREA CHART */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="nn-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Intelligence Volume</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Signal activity over 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="nn-badge nn-badge-violet">+14.2%</span>
              <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-white transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-56" suppressHydrationWarning>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="url(#grad)"
                  strokeOpacity={0.9}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RECENT ISSUES */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="nn-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">Recent Issues</h3>
            <a href="/signals" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="p-3.5 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-violet-500/10 transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors leading-snug">{issue.title}</p>
                  <span className={`flex-shrink-0 nn-badge text-[10px] ${
                    issue.priority === "Critical" ? "nn-badge-violet" :
                    issue.priority === "High" ? "bg-orange-500/10 border-orange-500/30 text-orange-400" :
                    "bg-zinc-500/10 border-zinc-500/30 text-zinc-400"
                  }`}>{issue.priority}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-[10px] font-semibold ${
                    issue.status === "Resolved" ? "text-emerald-400" :
                    issue.status === "Investigating" ? "text-amber-400" : "text-zinc-500"
                  }`}>{issue.status}</span>
                  <span className="text-[10px] text-zinc-600">{issue.time}</span>
                  <span className="ml-auto text-[10px] text-zinc-600">{issue.trust} trust</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* GLOBAL REACH */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="nn-card-glow p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
            <Globe className="w-7 h-7 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-1">Global Reach</p>
            <p className="text-4xl font-bold text-white">2.4M</p>
            <p className="text-sm text-zinc-500 mt-1">developers in the network</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">+14.2% this month</span>
        </div>
      </motion.div>
    </div>
  );
}
