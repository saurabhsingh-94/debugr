"use client";

import { motion } from "framer-motion";
import { 
  ResponsiveContainer, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-border p-3 rounded-lg shadow-xl">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// --- BAR CHART ---
export function BarChartCard({ data }: { data: any[] }) {
  return (
    <div className="bg-card border border-border p-8 rounded-2xl h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Activity Distribution</h3>
        <select className="bg-zinc-800 border border-border text-[10px] font-bold text-zinc-400 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 600 }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#22d3ee"} fillOpacity={index === data.length - 1 ? 1 : 0.6} />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- DONUT CHART ---
export function DonutChartCard({ data, total }: { data: any[], total: string }) {
  return (
    <div className="bg-card border border-border p-8 rounded-2xl h-[400px] flex flex-col relative overflow-hidden">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-8">Category Mix</h3>
      
      <div className="flex-1 w-full relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</p>
          <p className="text-3xl font-black text-white tracking-tighter">{total}</p>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{item.name}</span>
            <span className="text-[10px] font-bold text-white ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
