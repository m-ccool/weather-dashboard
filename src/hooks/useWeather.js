import { useQuery } from '@tanstack/react-query';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

async function fetchCurrentWeather(city) {
  const res = await fetch(
    `${BASE}/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${API_KEY}`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error(`City "${city}" not found.`);
    throw new Error(`Weather fetch failed (${res.status})`);
  }
  return res.json();
}

async function fetchForecast(city) {
  const res = await fetch(
    `${BASE}/forecast?q=${encodeURIComponent(city)}&units=imperial&appid=${API_KEY}`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error(`City "${city}" not found.`);
    throw new Error(`Forecast fetch failed (${res.status})`);
  }
  const data = await res.json();
  // Pick one reading per day at noon
  const seen = new Set();
  return data.list
    .filter((item) => {
      const day = item.dt_txt.split(' ')[0];
      const time = item.dt_txt.split(' ')[1];
      if (!seen.has(day) && time === '12:00:00') {
        seen.add(day);
        return true;
      }
      return false;
    })
    .slice(0, 5);
}

export function useWeather(city) {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchCurrentWeather(city),
    enabled: Boolean(city),
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 1,
  });
}

export function useForecast(city) {
  return useQuery({
    queryKey: ['forecast', city],
    queryFn: () => fetchForecast(city),
    enabled: Boolean(city),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}
