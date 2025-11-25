import { useState } from 'react';
import { AppState } from '../types/index.ts';

export const useLocalStorage = (key: string, initialValue: AppState) => {
  const [storedValue, setStoredValue] = useState<AppState>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: AppState | ((val: AppState) => AppState)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};