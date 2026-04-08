import { useState, useEffect } from 'react';
import type { District, TrendData } from './mockData';
import { loadDistrictData, loadTrendData, loadStates } from './dataLoader';

interface UseDataReturn {
  districts: District[];
  trendData: TrendData[];
  states: string[];
  loading: boolean;
  error: Error | null;
}

export function useData(): UseDataReturn {
  const [districts, setDistricts] = useState<District[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [districtsData, trendDataResult, statesData] = await Promise.all([
          loadDistrictData(),
          loadTrendData(),
          loadStates()
        ]);
        setDistricts(districtsData);
        setTrendData(trendDataResult);
        setStates(statesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { districts, trendData, states, loading, error };
}
