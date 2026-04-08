export interface District {
  id: string;
  name: string;
  state: string;
  cases: number;
  recovered: number;
  deaths: number;
  population: number;
  growthRate: number;
  riskLevel: "high" | "medium" | "low";
  beds: number;
  bedsAvailable: number;
  icu: number;
  icuAvailable: number;
  oxygen: number;
  oxygenAvailable: number;
  lat: number;
  lng: number;
}

export interface TrendData {
  date: string;
  cases: number;
  recovered: number;
  deaths: number;
  predicted?: number;
}

export const districts: District[] = [
  { id: "d1", name: "Chennai", state: "Tamil Nadu", cases: 15420, recovered: 12300, deaths: 210, population: 7090000, growthRate: 4.2, riskLevel: "high", beds: 5000, bedsAvailable: 800, icu: 500, icuAvailable: 50, oxygen: 2000, oxygenAvailable: 300, lat: 13.08, lng: 80.27 },
  { id: "d2", name: "Mumbai", state: "Maharashtra", cases: 22310, recovered: 18500, deaths: 380, population: 12440000, growthRate: 3.8, riskLevel: "high", beds: 8000, bedsAvailable: 1200, icu: 800, icuAvailable: 90, oxygen: 3500, oxygenAvailable: 500, lat: 19.07, lng: 72.87 },
  { id: "d3", name: "Delhi", state: "Delhi", cases: 18900, recovered: 15200, deaths: 290, population: 11030000, growthRate: 3.5, riskLevel: "high", beds: 7000, bedsAvailable: 1000, icu: 700, icuAvailable: 80, oxygen: 3000, oxygenAvailable: 450, lat: 28.61, lng: 77.20 },
  { id: "d4", name: "Bengaluru", state: "Karnataka", cases: 9800, recovered: 8200, deaths: 120, population: 8400000, growthRate: 2.5, riskLevel: "medium", beds: 4000, bedsAvailable: 1500, icu: 400, icuAvailable: 150, oxygen: 1800, oxygenAvailable: 700, lat: 12.97, lng: 77.59 },
  { id: "d5", name: "Kolkata", state: "West Bengal", cases: 7600, recovered: 6400, deaths: 95, population: 4500000, growthRate: 2.1, riskLevel: "medium", beds: 3500, bedsAvailable: 1200, icu: 350, icuAvailable: 120, oxygen: 1500, oxygenAvailable: 600, lat: 22.57, lng: 88.36 },
  { id: "d6", name: "Hyderabad", state: "Telangana", cases: 8200, recovered: 7100, deaths: 105, population: 6800000, growthRate: 2.3, riskLevel: "medium", beds: 3800, bedsAvailable: 1400, icu: 380, icuAvailable: 140, oxygen: 1600, oxygenAvailable: 650, lat: 17.38, lng: 78.48 },
  { id: "d7", name: "Pune", state: "Maharashtra", cases: 6500, recovered: 5800, deaths: 78, population: 3100000, growthRate: 1.8, riskLevel: "medium", beds: 3000, bedsAvailable: 1100, icu: 300, icuAvailable: 110, oxygen: 1200, oxygenAvailable: 500, lat: 18.52, lng: 73.85 },
  { id: "d8", name: "Jaipur", state: "Rajasthan", cases: 4200, recovered: 3800, deaths: 42, population: 3100000, growthRate: 1.2, riskLevel: "low", beds: 2500, bedsAvailable: 1600, icu: 250, icuAvailable: 180, oxygen: 1000, oxygenAvailable: 700, lat: 26.91, lng: 75.78 },
  { id: "d9", name: "Lucknow", state: "Uttar Pradesh", cases: 3800, recovered: 3500, deaths: 35, population: 2800000, growthRate: 1.0, riskLevel: "low", beds: 2200, bedsAvailable: 1500, icu: 220, icuAvailable: 170, oxygen: 900, oxygenAvailable: 650, lat: 26.84, lng: 80.94 },
  { id: "d10", name: "Ahmedabad", state: "Gujarat", cases: 5100, recovered: 4600, deaths: 55, population: 5600000, growthRate: 1.5, riskLevel: "low", beds: 2800, bedsAvailable: 1700, icu: 280, icuAvailable: 200, oxygen: 1100, oxygenAvailable: 750, lat: 23.02, lng: 72.57 },
  { id: "d11", name: "Coimbatore", state: "Tamil Nadu", cases: 3400, recovered: 3100, deaths: 30, population: 1600000, growthRate: 0.9, riskLevel: "low", beds: 1800, bedsAvailable: 1200, icu: 180, icuAvailable: 140, oxygen: 700, oxygenAvailable: 550, lat: 11.01, lng: 76.95 },
  { id: "d12", name: "Nagpur", state: "Maharashtra", cases: 4800, recovered: 4200, deaths: 52, population: 2400000, growthRate: 1.6, riskLevel: "medium", beds: 2400, bedsAvailable: 900, icu: 240, icuAvailable: 90, oxygen: 950, oxygenAvailable: 400, lat: 21.14, lng: 79.08 },
];

export const trendData: TrendData[] = [
  { date: "Mar 01", cases: 45000, recovered: 38000, deaths: 850, predicted: 44500 },
  { date: "Mar 05", cases: 52000, recovered: 42000, deaths: 920, predicted: 51000 },
  { date: "Mar 10", cases: 61000, recovered: 48000, deaths: 1020, predicted: 60000 },
  { date: "Mar 15", cases: 72000, recovered: 55000, deaths: 1150, predicted: 71500 },
  { date: "Mar 20", cases: 78000, recovered: 62000, deaths: 1250, predicted: 79000 },
  { date: "Mar 25", cases: 85000, recovered: 69000, deaths: 1340, predicted: 86000 },
  { date: "Mar 30", cases: 91000, recovered: 75000, deaths: 1420, predicted: 92500 },
  { date: "Apr 04", cases: 98000, recovered: 81000, deaths: 1510, predicted: 99000 },
  { date: "Apr 09", cases: undefined as unknown as number, recovered: undefined as unknown as number, deaths: undefined as unknown as number, predicted: 106000 },
  { date: "Apr 14", cases: undefined as unknown as number, recovered: undefined as unknown as number, deaths: undefined as unknown as number, predicted: 113500 },
  { date: "Apr 19", cases: undefined as unknown as number, recovered: undefined as unknown as number, deaths: undefined as unknown as number, predicted: 121000 },
];

export const states = [...new Set(districts.map(d => d.state))];

export function predictFutureCases(
  currentCases: number,
  population: number,
  growthRate: number,
  days: number
): number[] {
  const results: number[] = [];
  let cases = currentCases;
  for (let i = 1; i <= days; i++) {
    const dailyGrowth = growthRate / 100;
    const capacityFactor = 1 - (cases / population);
    cases = Math.round(cases * (1 + dailyGrowth * capacityFactor));
    results.push(cases);
  }
  return results;
}

export function classifyRisk(cases: number, population: number, growthRate: number): "high" | "medium" | "low" {
  const caseRate = (cases / population) * 100000;
  if (caseRate > 150 || growthRate > 3) return "high";
  if (caseRate > 80 || growthRate > 1.5) return "medium";
  return "low";
}

export function calculateResourceNeeds(predictedCases: number): {
  beds: number;
  icu: number;
  oxygen: number;
  priority: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
} {
  const hospitalizationRate = 0.15;
  const icuRate = 0.05;
  const oxygenRate = 0.10;

  const beds = Math.ceil(predictedCases * hospitalizationRate);
  const icu = Math.ceil(predictedCases * icuRate);
  const oxygen = Math.ceil(predictedCases * oxygenRate);

  let priority: "CRITICAL" | "HIGH" | "MODERATE" | "LOW" = "LOW";
  if (predictedCases > 15000) priority = "CRITICAL";
  else if (predictedCases > 8000) priority = "HIGH";
  else if (predictedCases > 4000) priority = "MODERATE";

  return { beds, icu, oxygen, priority };
}
