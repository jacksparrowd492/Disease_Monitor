import { useState, useMemo } from "react";
import { Filter, X, Loader2 } from "lucide-react";
import StatsCards from "../components/StatsCards";
import ChartComponent from "../components/ChartComponent";
import FilterPanel from "../components/FilterPanel";
import { useData } from "../data/useData";

export default function DashboardPage() {
  const { districts: allDistricts, states, trendData, loading, error } = useData();
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

  return (
    <div>
      <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-card">
        <div>
          <h2 className="text-lg font-bold text-foreground">Overview Dashboard</h2>
          <p className="text-xs text-muted-foreground">National disease surveillance summary</p>
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
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-white/80" />
            )}
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
          <StatsCards districts={filteredDistricts} />
          <ChartComponent districts={filteredDistricts} trendData={trendData} />
        </>
      )}
    </div>
  );
}
