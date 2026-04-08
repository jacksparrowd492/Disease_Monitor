import { TrendingUp, Users, HeartPulse, Skull } from "lucide-react";
import type { District } from "../data/mockData";

interface StatsCardsProps {
  districts: District[];
}

export default function StatsCards({ districts }: StatsCardsProps) {
  const totalCases = districts.reduce((sum, d) => sum + d.cases, 0);
  const totalRecovered = districts.reduce((sum, d) => sum + d.recovered, 0);
  const totalDeaths = districts.reduce((sum, d) => sum + d.deaths, 0);
  const activeCases = totalCases - totalRecovered - totalDeaths;
  const avgGrowth = (districts.reduce((sum, d) => sum + d.growthRate, 0) / districts.length).toFixed(1);

  const stats = [
    {
      label: "Total Cases",
      value: totalCases.toLocaleString(),
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Cases",
      value: activeCases.toLocaleString(),
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Recovered",
      value: totalRecovered.toLocaleString(),
      icon: HeartPulse,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Deaths",
      value: totalDeaths.toLocaleString(),
      icon: Skull,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border border-border p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {stat.label}
            </span>
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}
      <div className="col-span-2 lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Growth Rate</p>
          <p className="text-xl font-bold text-foreground">{avgGrowth}%</p>
        </div>
        <div className="ml-auto flex gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            {districts.filter(d => d.riskLevel === "high").length} High Risk
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            {districts.filter(d => d.riskLevel === "medium").length} Medium
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {districts.filter(d => d.riskLevel === "low").length} Low
          </span>
        </div>
      </div>
    </div>
  );
}
