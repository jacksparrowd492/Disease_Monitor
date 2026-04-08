import { useState, useMemo } from "react";
import { Filter, X, AlertTriangle, Bed, Heart, Wind, TrendingUp, Loader2 } from "lucide-react";
import PredictionForm from "../components/PredictionForm";
import FilterPanel from "../components/FilterPanel";
import { useData } from "../data/useData";
import type { District } from "../data/mockData";

function ResourceBar({ label, used, total, icon: Icon, color }: {
  label: string;
  used: number;
  total: number;
  icon: typeof Bed;
  color: string;
}) {
  const available = total - used;
  const percentage = ((total - available) / total) * 100;
  const isLow = percentage > 80;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
        <span className={`text-xs font-semibold ${isLow ? "text-red-600" : "text-muted-foreground"}`}>
          {available.toLocaleString()} avail / {total.toLocaleString()}
        </span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLow ? "bg-red-500" : percentage > 60 ? "bg-yellow-500" : "bg-emerald-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DistrictResourceCard({ district }: { district: District }) {
  const icuUtil = ((district.icu - district.icuAvailable) / district.icu) * 100;
  const bedUtil = ((district.beds - district.bedsAvailable) / district.beds) * 100;
  const isCritical = icuUtil > 85 || bedUtil > 85;

  return (
    <div className={`bg-card rounded-xl border shadow-sm p-4 space-y-3 ${isCritical ? "border-red-300" : "border-border"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{district.name}</p>
          <p className="text-[10px] text-muted-foreground">{district.state}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {isCritical && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            district.riskLevel === "high" ? "bg-red-100 text-red-700" :
            district.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" :
            "bg-green-100 text-green-700"
          }`}>
            {district.riskLevel}
          </span>
        </div>
      </div>
      <ResourceBar label="Beds" used={district.beds - district.bedsAvailable} total={district.beds} icon={Bed} color="text-blue-500" />
      <ResourceBar label="ICU" used={district.icu - district.icuAvailable} total={district.icu} icon={Heart} color="text-red-500" />
      <ResourceBar label="Oxygen" used={district.oxygen - district.oxygenAvailable} total={district.oxygen} icon={Wind} color="text-cyan-500" />
      <div className="flex items-center gap-1.5 pt-1">
        <TrendingUp className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">Growth: <span className="font-semibold text-foreground">{district.growthRate}%/day</span></span>
        <span className="ml-auto text-[10px] text-muted-foreground">{district.cases.toLocaleString()} cases</span>
      </div>
    </div>
  );
}

export default function ResourcePage() {
  const { districts: allDistricts, states, loading, error } = useData();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");

  const filteredDistricts = useMemo(() => {
    return allDistricts.filter((d) => {
      if (selectedState !== "all" && d.state !== selectedState) return false;
      if (selectedRisk !== "all" && d.riskLevel !== selectedRisk) return false;
      return true;
    });
  }, [allDistricts, selectedState, selectedRisk]);

  const hasActiveFilters = selectedState !== "all" || selectedRisk !== "all";

  const totalBeds = filteredDistricts.reduce((s, d) => s + d.beds, 0);
  const totalBedsUsed = filteredDistricts.reduce((s, d) => s + (d.beds - d.bedsAvailable), 0);
  const totalIcu = filteredDistricts.reduce((s, d) => s + d.icu, 0);
  const totalIcuUsed = filteredDistricts.reduce((s, d) => s + (d.icu - d.icuAvailable), 0);
  const totalOxygen = filteredDistricts.reduce((s, d) => s + d.oxygen, 0);
  const totalOxygenUsed = filteredDistricts.reduce((s, d) => s + (d.oxygen - d.oxygenAvailable), 0);

  const criticalDistricts = filteredDistricts.filter(
    (d) => (d.icu - d.icuAvailable) / d.icu > 0.85 || (d.beds - d.bedsAvailable) / d.beds > 0.85
  );

  const sortedDistricts = [...filteredDistricts].sort((a, b) => {
    const aUtil = (a.icu - a.icuAvailable) / a.icu;
    const bUtil = (b.icu - b.icuAvailable) / b.icu;
    return bUtil - aUtil;
  });

  return (
    <div>
      <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-card">
        <div>
          <h2 className="text-lg font-bold text-foreground">Resource Planning</h2>
          <p className="text-xs text-muted-foreground">Hospital capacity, allocations, and scenario simulation</p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={() => { setSelectedState("all"); setSelectedRisk("all"); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg bg-muted hover:bg-accent transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtersOpen || hasActiveFilters
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {filtersOpen && (
        <FilterPanel
          selectedState={selectedState}
          selectedRisk={selectedRisk}
          onStateChange={setSelectedState}
          onRiskChange={setSelectedRisk}
          onClose={() => setFiltersOpen(false)}
          availableStates={states}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading data...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500">
          Error loading data: {error.message}
        </div>
      ) : (
        <>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase">Hospital Beds</span>
            </div>
            <ResourceBar label="" used={totalBedsUsed} total={totalBeds} icon={Bed} color="text-blue-500" />
            <p className="text-[11px] text-muted-foreground">
              {(totalBeds - totalBedsUsed).toLocaleString()} of {totalBeds.toLocaleString()} available
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase">ICU Units</span>
            </div>
            <ResourceBar label="" used={totalIcuUsed} total={totalIcu} icon={Heart} color="text-red-500" />
            <p className="text-[11px] text-muted-foreground">
              {(totalIcu - totalIcuUsed).toLocaleString()} of {totalIcu.toLocaleString()} available
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase">Oxygen Supply</span>
            </div>
            <ResourceBar label="" used={totalOxygenUsed} total={totalOxygen} icon={Wind} color="text-cyan-500" />
            <p className="text-[11px] text-muted-foreground">
              {(totalOxygen - totalOxygenUsed).toLocaleString()} of {totalOxygen.toLocaleString()} units available
            </p>
          </div>
        </div>

        {criticalDistricts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">Critical Capacity Alerts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {criticalDistricts.map((d) => {
                const icuUtil = (((d.icu - d.icuAvailable) / d.icu) * 100).toFixed(0);
                const bedUtil = (((d.beds - d.bedsAvailable) / d.beds) * 100).toFixed(0);
                return (
                  <div key={d.id} className="bg-white rounded-lg border border-red-200 p-2.5">
                    <p className="text-sm font-semibold text-foreground">{d.name}</p>
                    <p className="text-[11px] text-red-600">ICU: {icuUtil}% · Beds: {bedUtil}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">District Capacity (by ICU utilization)</h3>
            <div className="grid grid-cols-1 gap-3">
              {sortedDistricts.map((d) => (
                <DistrictResourceCard key={d.id} district={d} />
              ))}
            </div>
          </div>
          <div className="sticky top-20">
            <PredictionForm />
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
