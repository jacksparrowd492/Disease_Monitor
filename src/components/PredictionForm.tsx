import { useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { predictFutureCases, classifyRisk, calculateResourceNeeds } from "../data/mockData";

export default function PredictionForm() {
  const [district, setDistrict] = useState("");
  const [currentCases, setCurrentCases] = useState("");
  const [population, setPopulation] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [hospitalCapacity, setHospitalCapacity] = useState("");
  const [result, setResult] = useState<null | {
    predictions: number[];
    risk: "high" | "medium" | "low";
    resources: ReturnType<typeof calculateResourceNeeds>;
    chartData: { day: string; cases: number }[];
  }>(null);

  function handlePredict() {
    const cases = parseInt(currentCases) || 0;
    const pop = parseInt(population) || 1000000;
    const rate = parseFloat(growthRate) || 2;

    const predictions = predictFutureCases(cases, pop, rate, 14);
    const risk = classifyRisk(cases, pop, rate);
    const finalCases = predictions[predictions.length - 1];
    const resources = calculateResourceNeeds(finalCases);

    const chartData = [
      { day: "Today", cases },
      ...predictions.map((p, i) => ({ day: `Day ${i + 1}`, cases: p })),
    ];

    setResult({ predictions, risk, resources, chartData });
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Calculator className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Scenario Prediction</h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground">District / Region</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Chennai"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Current Cases</label>
            <input
              type="number"
              value={currentCases}
              onChange={(e) => setCurrentCases(e.target.value)}
              placeholder="e.g. 5000"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Population</label>
            <input
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              placeholder="e.g. 7000000"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Growth Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={growthRate}
              onChange={(e) => setGrowthRate(e.target.value)}
              placeholder="e.g. 3.5"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Hospital Capacity</label>
            <input
              type="number"
              value={hospitalCapacity}
              onChange={(e) => setHospitalCapacity(e.target.value)}
              placeholder="e.g. 2000"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={!currentCases || !population || !growthRate}
          className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Run Prediction
        </button>

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-3 gap-2">
              <div className={`rounded-lg p-3 text-center ${
                result.risk === "high" ? "bg-red-50 border border-red-200" :
                result.risk === "medium" ? "bg-yellow-50 border border-yellow-200" :
                "bg-green-50 border border-green-200"
              }`}>
                <p className="text-[10px] font-medium text-muted-foreground uppercase">Risk Level</p>
                <p className={`text-sm font-bold capitalize ${
                  result.risk === "high" ? "text-red-700" :
                  result.risk === "medium" ? "text-yellow-700" :
                  "text-green-700"
                }`}>{result.risk}</p>
              </div>
              <div className={`rounded-lg p-3 text-center ${
                result.resources.priority === "CRITICAL" ? "bg-red-50 border border-red-200" :
                result.resources.priority === "HIGH" ? "bg-orange-50 border border-orange-200" :
                "bg-blue-50 border border-blue-200"
              }`}>
                <p className="text-[10px] font-medium text-muted-foreground uppercase">Priority</p>
                <p className="text-sm font-bold text-foreground">{result.resources.priority}</p>
              </div>
              <div className="rounded-lg p-3 text-center bg-purple-50 border border-purple-200">
                <p className="text-[10px] font-medium text-muted-foreground uppercase">14-Day Cases</p>
                <p className="text-sm font-bold text-purple-700">{result.predictions[13]?.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-foreground mb-2">Predicted Case Curve</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={2} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="cases" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-foreground">Resource Recommendation</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                  <p className="text-[10px] text-muted-foreground">Beds</p>
                  <p className="text-sm font-bold text-blue-700">{result.resources.beds.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 border border-red-100">
                  <p className="text-[10px] text-muted-foreground">ICU</p>
                  <p className="text-sm font-bold text-red-700">{result.resources.icu.toLocaleString()}</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-2 border border-cyan-100">
                  <p className="text-[10px] text-muted-foreground">Oxygen</p>
                  <p className="text-sm font-bold text-cyan-700">{result.resources.oxygen.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
