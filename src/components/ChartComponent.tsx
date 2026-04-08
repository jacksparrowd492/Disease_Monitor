import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import type { District, TrendData } from "../data/mockData";

interface ChartComponentProps {
  districts: District[];
  trendData: TrendData[];
}

export default function ChartComponent({ districts, trendData }: ChartComponentProps) {
  const infectionRateData = districts.map((d) => ({
    name: d.name,
    rate: ((d.cases / d.population) * 100).toFixed(2),
    growthRate: d.growthRate,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Case Trends & Predictions</h3>
        <p className="text-xs text-muted-foreground mb-4">Actual vs predicted cases over time</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="casesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0,0%,100%)",
                border: "1px solid hsl(220,13%,91%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area type="monotone" dataKey="cases" stroke="#3b82f6" fill="url(#casesGrad)" strokeWidth={2} name="Actual Cases" connectNulls={false} />
            <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" fill="url(#predictedGrad)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Recovery & Death Trends</h3>
        <p className="text-xs text-muted-foreground mb-4">Recovered and death counts over time</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendData.filter(d => d.recovered)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0,0%,100%)",
                border: "1px solid hsl(220,13%,91%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="recovered" stroke="#22c55e" strokeWidth={2} dot={false} name="Recovered" />
            <Line type="monotone" dataKey="deaths" stroke="#ef4444" strokeWidth={2} dot={false} name="Deaths" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Infection Rate by District</h3>
        <p className="text-xs text-muted-foreground mb-4">Cases per 100 population</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={infectionRateData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0,0%,100%)",
                border: "1px solid hsl(220,13%,91%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Infection Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Growth Rate by District</h3>
        <p className="text-xs text-muted-foreground mb-4">Daily case growth percentage</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={infectionRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0,0%,100%)",
                border: "1px solid hsl(220,13%,91%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="growthRate" name="Growth Rate %" radius={[4, 4, 0, 0]}>
              {infectionRateData.map((entry, index) => {
                const rate = parseFloat(String(entry.growthRate));
                let fill = "#22c55e";
                if (rate > 3) fill = "#ef4444";
                else if (rate > 1.5) fill = "#f59e0b";
                return <rect key={index} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
