import { useQuery } from '@tanstack/react-query';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

async function fetchCurrentWeather(query) {
  const units = query?.units || 'imperial';
  const searchUrl = query?.coords
    ? `${BASE}/weather?lat=${query.coords.lat}&lon=${query.coords.lon}&units=${units}&appid=${API_KEY}`
    : `${BASE}/weather?q=${encodeURIComponent(query.city)}&units=${units}&appid=${API_KEY}`;

  const res = await fetch(searchUrl);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Location not found.');
    throw new Error(`Weather fetch failed (${res.status})`);
  }
  return res.json();
}

async function fetchForecast(query) {
  const units = query?.units || 'imperial';
  const searchUrl = query?.coords
    ? `${BASE}/forecast?lat=${query.coords.lat}&lon=${query.coords.lon}&units=${units}&appid=${API_KEY}`
    : `${BASE}/forecast?q=${encodeURIComponent(query.city)}&units=${units}&appid=${API_KEY}`;

  const res = await fetch(searchUrl);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Location not found.');
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

export function useWeather(query) {
  return useQuery({
    queryKey: ['weather', query?.city, query?.coords?.lat, query?.coords?.lon, query?.units],
    queryFn: () => fetchCurrentWeather(query),
    enabled: Boolean(query?.city || query?.coords),
    staleTime: 1000 * 60 * 10, // 10 min
    retry: 1,
  });
}

export function useForecast(query) {
  return useQuery({
    queryKey: ['forecast', query?.city, query?.coords?.lat, query?.coords?.lon, query?.units],
    queryFn: () => fetchForecast(query),
    enabled: Boolean(query?.city || query?.coords),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}
