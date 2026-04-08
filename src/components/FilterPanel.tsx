import { X } from "lucide-react";

interface FilterPanelProps {
  selectedState: string;
  selectedRisk: string;
  onStateChange: (state: string) => void;
  onRiskChange: (risk: string) => void;
  onClose: () => void;
  availableStates: string[];
}

export default function FilterPanel({
  selectedState,
  selectedRisk,
  onStateChange,
  onRiskChange,
  onClose,
  availableStates,
}: FilterPanelProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 animate-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Filter Dashboard</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">State</label>
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All States</option>
            {availableStates.map((s: string) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Risk Level</label>
          <select
            value={selectedRisk}
            onChange={(e) => onRiskChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              onStateChange("all");
              onRiskChange("all");
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
