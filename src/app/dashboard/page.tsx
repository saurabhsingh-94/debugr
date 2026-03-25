import StatCard from "@/components/Dashboard/StatCard";
import { BarChartCard, DonutChartCard } from "@/components/Dashboard/ChartCards";
import ProgressList from "@/components/Dashboard/ProgressList";
import DataTable from "@/components/Dashboard/DataTable";

const STAT_DATA = [
  { title: "Total Signals", value: "2,842", change: "1.19%", isPositive: true, color: "#22d3ee" },
  { title: "Avg. Resolution", value: "94.2%", change: "0.4%", isPositive: true, color: "#22c55e" },
  { title: "Priority Load", value: "8.4k", change: "12.5%", isPositive: false, color: "#ef4444" },
  { title: "Active Bounties", value: "156", change: "42", isPositive: true, color: "#facc15" },
];

const MOCK_CHART_DATA = Array.from({ length: 6 }).map((_, i) => ({ value: Math.floor(Math.random() * 50) + 10 }));

const BAR_DATA = [
  { name: "Apr", value: 400 },
  { name: "May", value: 700 },
  { name: "Jun", value: 550 },
  { name: "Jul", value: 900 },
  { name: "Aug", value: 1200 },
  { name: "Sep", value: 1100 },
];

const PIE_DATA = [
  { name: "Security", value: 45, color: "#ef4444" },
  { name: "Performance", value: 25, color: "#22d3ee" },
  { name: "UI/UX", value: 20, color: "#facc15" },
  { name: "DevOps", value: 10, color: "#22c55e" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_DATA.map((stat) => (
          <StatCard 
            key={stat.title} 
            {...stat} 
            chartData={MOCK_CHART_DATA} 
          />
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="w-full">
        <BarChartCard data={BAR_DATA} />
      </div>

      {/* BOTTOM SECTION */}
      <div className="w-full">
        <DataTable />
      </div>
    </div>
  );
}
