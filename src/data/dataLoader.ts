import Papa from 'papaparse';
import type { District, TrendData } from './mockData';

export interface StateData {
  name: string;
  confirmed: number;
  recovered: number;
  deaths: number;
  active: number;
  lat: number;
  lng: number;
  growthRate: number;
  lastUpdated: string;
}

export interface DistrictRaw {
  SlNo: string;
  State_Code: string;
  State: string;
  District_Key: string;
  District: string;
  Confirmed: string;
  Active: string;
  Recovered: string;
  Deceased: string;
  Migrated_Other: string;
  Delta_Confirmed: string;
  Delta_Active: string;
  Delta_Recovered: string;
  Delta_Deceased: string;
  District_Notes: string;
  Last_Updated: string;
}

export interface CompleteDataRaw {
  Date: string;
  State: string;
  Latitude: string;
  Longitude: string;
  Confirmed: string;
  Deaths: string;
  Recovered: string;
  New_Cases: string;
  New_Deaths: string;
  New_Recovered: string;
  Active: string;
  Prev_Confirmed: string;
  Growth_Rate: string;
}

export interface StateLatestRaw {
  State: string;
  Confirmed: string;
  Recovered: string;
  Deaths: string;
  Active: string;
  Last_Updated_Time: string;
  Migrated_Other: string;
  State_code: string;
  Delta_Confirmed: string;
  Delta_Recovered: string;
  Delta_Deaths: string;
  State_Notes: string;
}

// Parse CSV file
async function fetchCSV<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as T[]);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

// Get latest data for each state from complete.csv
export async function loadStateData(): Promise<StateData[]> {
  const data = await fetchCSV<CompleteDataRaw>('/data/cleaned_complete.csv');
  
  // Group by state and get latest entry for each
  const stateMap = new Map<string, CompleteDataRaw[]>();
  
  data.forEach(row => {
    if (!stateMap.has(row.State)) {
      stateMap.set(row.State, []);
    }
    stateMap.get(row.State)!.push(row);
  });
  
  const latestStates: StateData[] = [];
  
  stateMap.forEach((rows, stateName) => {
    // Sort by date descending and get latest
    const sorted = rows.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    const latest = sorted[0];
    
    if (latest && latest.Latitude && latest.Longitude) {
      latestStates.push({
        name: stateName,
        confirmed: parseFloat(latest.Confirmed) || 0,
        recovered: parseFloat(latest.Recovered) || 0,
        deaths: parseFloat(latest.Deaths) || 0,
        active: parseFloat(latest.Active) || 0,
        lat: parseFloat(latest.Latitude),
        lng: parseFloat(latest.Longitude),
        growthRate: parseFloat(latest.Growth_Rate) || 0,
        lastUpdated: latest.Date
      });
    }
  });
  
  return latestStates;
}

// Load district data
export async function loadDistrictData(): Promise<District[]> {
  const data = await fetchCSV<DistrictRaw>('/data/cleaned_district.csv');
  
  // Get state coordinates from complete data for mapping districts
  const stateData = await loadStateData();
  const stateCoords = new Map(stateData.map(s => [s.name, { lat: s.lat, lng: s.lng }]));
  
  // Add some offset for districts within same state
  const stateDistrictCount = new Map<string, number>();
  
  return data
    .filter(row => row.District && row.District !== 'Unassigned' && row.District !== 'Other State' && row.District !== 'Foreign Evacuees' && row.District !== 'Airport Quarantine')
    .map((row, index) => {
      const state = row.State;
      const baseCoords = stateCoords.get(state) || { lat: 20.5937, lng: 78.9629 }; // Default to center of India
      
      // Count districts per state for offset calculation
      const count = stateDistrictCount.get(state) || 0;
      stateDistrictCount.set(state, count + 1);
      
      // Add small offset based on district index to spread them out
      const offsetLat = (Math.random() - 0.5) * 2;
      const offsetLng = (Math.random() - 0.5) * 2;
      
      const confirmed = parseInt(row.Confirmed) || 0;
      const recovered = parseInt(row.Recovered) || 0;
      const deaths = parseInt(row.Deceased) || 0;
      const active = parseInt(row.Active) || 0;
      
      // Estimate population (not in dataset, using heuristic)
      const population = confirmed > 0 ? confirmed * 1000 : 100000;
      
      // Calculate growth rate from delta if available
      const deltaConfirmed = parseInt(row.Delta_Confirmed) || 0;
      const growthRate = confirmed > 0 ? (deltaConfirmed / confirmed) * 100 : 0;
      
      // Estimate hospital resources (not in dataset)
      const beds = Math.max(1000, Math.round(population / 1000));
      const bedsAvailable = Math.round(beds * (1 - (active / (confirmed || 1))));
      const icu = Math.round(beds * 0.1);
      const icuAvailable = Math.round(icu * 0.3);
      const oxygen = Math.round(beds * 0.4);
      const oxygenAvailable = Math.round(oxygen * 0.5);
      
      // Determine risk level
      let riskLevel: "high" | "medium" | "low" = "low";
      const caseRate = (confirmed / population) * 100000;
      if (caseRate > 150 || growthRate > 3) riskLevel = "high";
      else if (caseRate > 80 || growthRate > 1.5) riskLevel = "medium";
      
      return {
        id: `d${index}`,
        name: row.District,
        state: state,
        cases: confirmed,
        recovered: recovered,
        deaths: deaths,
        population: population,
        growthRate: growthRate,
        riskLevel: riskLevel,
        beds: beds,
        bedsAvailable: Math.max(0, bedsAvailable),
        icu: icu,
        icuAvailable: Math.max(0, icuAvailable),
        oxygen: oxygen,
        oxygenAvailable: Math.max(0, oxygenAvailable),
        lat: baseCoords.lat + offsetLat,
        lng: baseCoords.lng + offsetLng
      };
    })
    .filter(d => d.cases > 0); // Only include districts with cases
}

// Load trend data from complete.csv aggregated by date
export async function loadTrendData(): Promise<TrendData[]> {
  const data = await fetchCSV<CompleteDataRaw>('/data/cleaned_complete.csv');
  
  // Aggregate by date
  const dateMap = new Map<string, { cases: number; recovered: number; deaths: number }>();
  
  data.forEach(row => {
    const date = row.Date;
    if (!dateMap.has(date)) {
      dateMap.set(date, { cases: 0, recovered: 0, deaths: 0 });
    }
    const entry = dateMap.get(date)!;
    entry.cases += parseFloat(row.Confirmed) || 0;
    entry.recovered += parseFloat(row.Recovered) || 0;
    entry.deaths += parseFloat(row.Deaths) || 0;
  });
  
  // Convert to array and sort by date
  const sorted = Array.from(dateMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-30); // Last 30 days
  
  // Simple prediction using linear regression on last 7 days
  const last7 = sorted.slice(-7);
  const growthRates: number[] = [];
  
  for (let i = 1; i < last7.length; i++) {
    const prev = last7[i - 1][1].cases;
    const curr = last7[i][1].cases;
    if (prev > 0) {
      growthRates.push((curr - prev) / prev);
    }
  }
  
  const avgGrowthRate = growthRates.length > 0 
    ? growthRates.reduce((a, b) => a + b, 0) / growthRates.length 
    : 0;
  
  const lastEntry = sorted[sorted.length - 1];
  const lastCases = lastEntry[1].cases;
  
  // Generate predictions for next 5 days
  const predictions: TrendData[] = [];
  for (let i = 1; i <= 5; i++) {
    const predicted = Math.round(lastCases * Math.pow(1 + avgGrowthRate, i));
    const futureDate = new Date(lastEntry[0]);
    futureDate.setDate(futureDate.getDate() + i);
    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      cases: 0,
      recovered: 0,
      deaths: 0,
      predicted
    });
  }
  
  return [
    ...sorted.map(([date, values]) => ({
      date,
      cases: Math.round(values.cases),
      recovered: Math.round(values.recovered),
      deaths: Math.round(values.deaths)
    })),
    ...predictions
  ];
}

// Get states list
export async function loadStates(): Promise<string[]> {
  const districts = await loadDistrictData();
  return [...new Set(districts.map(d => d.state))];
}
