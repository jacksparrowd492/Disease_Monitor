import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { District } from "../data/mockData";

const riskConfig = {
  high: { color: "#ef4444", fillColor: "#ef4444", label: "High Risk" },
  medium: { color: "#f59e0b", fillColor: "#f59e0b", label: "Medium Risk" },
  low: { color: "#22c55e", fillColor: "#22c55e", label: "Low Risk" },
};

function FlyToDistrict({ district }: { district: District | null }) {
  const map = useMap();
  useEffect(() => {
    if (district) {
      map.flyTo([district.lat, district.lng], 8, { duration: 1.2 });
    }
  }, [district, map]);
  return null;
}

interface MapComponentProps {
  districts: District[];
  onSelectDistrict: (district: District) => void;
  selectedDistrict: District | null;
}

export default function MapComponent({ districts, onSelectDistrict, selectedDistrict }: MapComponentProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Live Disease Heatmap</h3>
          <p className="text-xs text-muted-foreground">Click a district circle for details</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {(["high", "medium", "low"] as const).map((level) => (
            <span key={level} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: riskConfig[level].color }}
              />
              {riskConfig[level].label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ height: 520 }}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <FlyToDistrict district={selectedDistrict} />

          {districts.map((district) => {
            const config = riskConfig[district.riskLevel];
            const radius = Math.max(10, Math.min(30, district.cases / 800));
            const isSelected = selectedDistrict?.id === district.id;
            const activeCases = district.cases - district.recovered - district.deaths;

            return (
              <CircleMarker
                key={district.id}
                center={[district.lat, district.lng]}
                radius={radius}
                pathOptions={{
                  color: isSelected ? "#1e40af" : config.color,
                  fillColor: config.fillColor,
                  fillOpacity: isSelected ? 0.85 : 0.6,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => onSelectDistrict(district),
                }}
              >
                <Popup>
                  <div className="text-sm space-y-1.5 min-w-[180px]">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-base text-gray-900">{district.name}</p>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase"
                        style={{
                          backgroundColor:
                            district.riskLevel === "high"
                              ? "#fee2e2"
                              : district.riskLevel === "medium"
                              ? "#fef3c7"
                              : "#dcfce7",
                          color:
                            district.riskLevel === "high"
                              ? "#b91c1c"
                              : district.riskLevel === "medium"
                              ? "#92400e"
                              : "#166534",
                        }}
                      >
                        {district.riskLevel}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{district.state}</p>
                    <hr />
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                      <span className="text-gray-500">Total Cases</span>
                      <span className="font-semibold text-gray-900">{district.cases.toLocaleString()}</span>
                      <span className="text-gray-500">Active</span>
                      <span className="font-semibold text-orange-600">{activeCases.toLocaleString()}</span>
                      <span className="text-gray-500">Recovered</span>
                      <span className="font-semibold text-green-600">{district.recovered.toLocaleString()}</span>
                      <span className="text-gray-500">Deaths</span>
                      <span className="font-semibold text-red-600">{district.deaths.toLocaleString()}</span>
                      <span className="text-gray-500">Growth/day</span>
                      <span className="font-semibold text-gray-900">{district.growthRate}%</span>
                      <span className="text-gray-500">ICU avail</span>
                      <span className="font-semibold text-gray-900">{district.icuAvailable} / {district.icu}</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
