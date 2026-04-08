import { Bed, Heart, Wind, AlertTriangle } from "lucide-react";
import type { District } from "../data/mockData";

interface ResourcePanelProps {
  districts: District[];
  selectedDistrict: District | null;
}

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
          {available} / {total}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
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

export default function ResourcePanel({ districts, selectedDistrict }: ResourcePanelProps) {
  const displayDistricts = selectedDistrict ? [selectedDistrict] : districts.filter(d => d.riskLevel === "high");

  const totalBeds = districts.reduce((s, d) => s + d.beds, 0);
  const totalBedsAvail = districts.reduce((s, d) => s + d.bedsAvailable, 0);
  const totalIcu = districts.reduce((s, d) => s + d.icu, 0);
  const totalIcuAvail = districts.reduce((s, d) => s + d.icuAvailable, 0);
  const totalOxygen = districts.reduce((s, d) => s + d.oxygen, 0);
  const totalOxygenAvail = districts.reduce((s, d) => s + d.oxygenAvailable, 0);

  const criticalDistricts = districts.filter(
    (d) => d.icuAvailable / d.icu < 0.15 || d.bedsAvailable / d.beds < 0.15
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Resource Allocation</h3>
        <p className="text-xs text-muted-foreground">Hospital capacity overview</p>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">National Summary</h4>
          <ResourceBar label="Hospital Beds" used={totalBeds - totalBedsAvail} total={totalBeds} icon={Bed} color="text-blue-500" />
          <ResourceBar label="ICU Units" used={totalIcu - totalIcuAvail} total={totalIcu} icon={Heart} color="text-red-500" />
          <ResourceBar label="Oxygen Supply" used={totalOxygen - totalOxygenAvail} total={totalOxygen} icon={Wind} color="text-cyan-500" />
        </div>

        {criticalDistricts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-semibold text-red-700">Critical Alerts</span>
            </div>
            {criticalDistricts.map((d) => (
              <p key={d.id} className="text-xs text-red-600 ml-6">
                {d.name}: ICU at {((1 - d.icuAvailable / d.icu) * 100).toFixed(0)}% capacity
              </p>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {selectedDistrict ? `${selectedDistrict.name} Details` : "High Priority Districts"}
          </h4>
          {displayDistricts.map((d) => (
            <div key={d.id} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{d.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                  d.riskLevel === "high"
                    ? "bg-red-100 text-red-700"
                    : d.riskLevel === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {d.riskLevel}
                </span>
              </div>
              <ResourceBar label="Beds" used={d.beds - d.bedsAvailable} total={d.beds} icon={Bed} color="text-blue-500" />
              <ResourceBar label="ICU" used={d.icu - d.icuAvailable} total={d.icu} icon={Heart} color="text-red-500" />
              <ResourceBar label="O2" used={d.oxygen - d.oxygenAvailable} total={d.oxygen} icon={Wind} color="text-cyan-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
