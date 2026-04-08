import { useState, useMemo } from "react";
import { Filter, X, MapPin, TrendingUp, Users, HeartPulse, Loader2 } from "lucide-react";
import MapComponent from "../components/MapComponent";
import FilterPanel from "../components/FilterPanel";
import { useData } from "../data/useData";
import type { District } from "../data/mockData";

function DistrictDetail({ district }: { district: District }) {
  const activeCases = district.cases - district.recovered - district.deaths;
  const recoveryRate = ((district.recovered / district.cases) * 100).toFixed(1);
  const icuUtil = (((district.icu - district.icuAvailable) / district.icu) * 100).toFixed(0);
  const bedUtil = (((district.beds - district.bedsAvailable) / district.beds) * 100).toFixed(0);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">{district.name}</h3>
          <p className="text-xs text-muted-foreground">{district.state}</p>
        </div>
        <span
          className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            district.riskLevel === "high"
              ? "bg-red-100 text-red-700"
              : district.riskLevel === "medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {district.riskLevel} risk
        </span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Total Cases</span>
          </div>
          <p className="text-lg font-bold text-blue-700">{district.cases.toLocaleString()}</p>
          <p className="text-[10px] text-blue-500">Growth: {district.growthRate}%/day</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Active</span>
          </div>
          <p className="text-lg font-bold text-orange-700">{activeCases.toLocaleString()}</p>
          <p className="text-[10px] text-orange-500">Recovery: {recoveryRate}%</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Recovered</span>
          </div>
          <p className="text-lg font-bold text-emerald-700">{district.recovered.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Deaths</span>
          </div>
          <p className="text-lg font-bold text-red-700">{district.deaths.toLocaleString()}</p>
        </div>

        <div className="col-span-2 space-y-2">
          <p className="text-xs font-semibold text-foreground">Hospital Utilization</p>
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Beds</span>
              <span>{bedUtil}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${Number(bedUtil) > 80 ? "bg-red-500" : Number(bedUtil) > 60 ? "bg-yellow-500" : "bg-emerald-500"}`}
                style={{ width: `${bedUtil}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>ICU Units</span>
              <span>{icuUtil}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${Number(icuUtil) > 80 ? "bg-red-500" : Number(icuUtil) > 60 ? "bg-yellow-500" : "bg-emerald-500"}`}
                style={{ width: `${icuUtil}%` }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          <p>Population: <span className="font-semibold text-foreground">{(district.population / 1000000).toFixed(1)}M</span></p>
          <p>Infection rate: <span className="font-semibold text-foreground">{((district.cases / district.population) * 100).toFixed(3)}%</span></p>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  const { districts: allDistricts, states, loading, error } = useData();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

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
          <h2 className="text-lg font-bold text-foreground">Disease Map</h2>
          <p className="text-xs text-muted-foreground">Interactive district-level heatmap — click a district for details</p>
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

      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MapComponent
            districts={filteredDistricts}
            onSelectDistrict={setSelectedDistrict}
            selectedDistrict={selectedDistrict}
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 text-center">
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">Loading data...</p>
            </div>
          ) : error ? (
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 text-center">
              <p className="text-sm font-medium text-red-500">Error loading data</p>
              <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
            </div>
          ) : selectedDistrict ? (
            <DistrictDetail district={selectedDistrict} />
          ) : (
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 text-center">
              <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Select a district</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Click any circle on the map to see detailed statistics</p>
            </div>
          )}

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">All Districts</h3>
            </div>
            <div className="divide-y divide-border max-h-72 overflow-y-auto">
              {filteredDistricts
                .sort((a, b) => b.cases - a.cases)
                .map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-accent transition-colors ${
                      selectedDistrict?.id === d.id ? "bg-accent" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.name}</p>
                      <p className="text-[10px] text-muted-foreground">{d.state}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{d.cases.toLocaleString()}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          d.riskLevel === "high" ? "bg-red-500" : d.riskLevel === "medium" ? "bg-yellow-500" : "bg-emerald-500"
                        }`}
                      />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
