import { useState, useMemo } from "react";
import TopBar from "./TopBar";
import FilterPanel from "./FilterPanel";
import StatsCards from "./StatsCards";
import MapComponent from "./MapComponent";
import ResourcePanel from "./ResourcePanel";
import ChartComponent from "./ChartComponent";
import PredictionForm from "./PredictionForm";
import ChatbotWidget from "./ChatbotWidget";
import { districts as allDistricts } from "../data/mockData";
import type { District } from "../data/mockData";

export default function Dashboard() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
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
  }, [selectedState, selectedRisk]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar
        onToggleChatbot={() => setChatbotOpen(!chatbotOpen)}
        onToggleFilters={() => setFiltersOpen(!filtersOpen)}
        filtersOpen={filtersOpen}
      />

      {filtersOpen && (
        <FilterPanel
          selectedState={selectedState}
          selectedRisk={selectedRisk}
          onStateChange={setSelectedState}
          onRiskChange={setSelectedRisk}
          onClose={() => setFiltersOpen(false)}
        />
      )}

      <StatsCards districts={filteredDistricts} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 pb-4">
        <div className="lg:col-span-5">
          <MapComponent
            districts={filteredDistricts}
            onSelectDistrict={setSelectedDistrict}
            selectedDistrict={selectedDistrict}
          />
        </div>
        <div className="lg:col-span-4">
          <PredictionForm />
        </div>
        <div className="lg:col-span-3">
          <ResourcePanel
            districts={filteredDistricts}
            selectedDistrict={selectedDistrict}
          />
        </div>
      </div>

      <ChartComponent districts={filteredDistricts} />

      {chatbotOpen && <ChatbotWidget onClose={() => setChatbotOpen(false)} />}
    </div>
  );
}
