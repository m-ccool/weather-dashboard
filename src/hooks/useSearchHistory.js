import { useState, useCallback } from 'react';

const STORAGE_KEY = 'weather_search_history';
const MAX_HISTORY = 8;

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const addToHistory = useCallback((city) => {
    setHistory((prev) => {
      const normalized = city.trim();
      const filtered = prev.filter((c) => c.toLowerCase() !== normalized.toLowerCase());
      const updated = [normalized, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
