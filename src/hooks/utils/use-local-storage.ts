import { useState } from "react";

type UseLocalStorageReturnType<Value> = [storedValue: Value, setStoredValue: (value: Value) => void];

export const useLocalStorage = <Value>(key: string, initialValue: Value): UseLocalStorageReturnType<Value> => {
  const [storedValue, setStoredValue] = useState<Value>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: Value) => {
    try {
      setStoredValue(value);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}