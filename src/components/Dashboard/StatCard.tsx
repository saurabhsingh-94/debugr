"use client";

import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  chartData: { value: number }[];
  color: string;
}

export default function StatCard({ title, value, change, isPositive, chartData, color }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
      className="bg-card border border-border p-6 rounded-2xl transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-md text-[10px] font-bold",
          isPositive ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"
        )}>
          {isPositive ? "+" : ""}{change}
        </div>
      </div>

      <div className="h-12 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
