import { useEffect, useState } from "react";

const DEFAULT_DEBOUNCE_DELAY = 300;

/** Returns the latest value only after it has remained unchanged for `delay` ms. */
export function useDebouncedValue<T>(
  value: T,
  delay = DEFAULT_DEBOUNCE_DELAY,
): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, Math.max(0, delay));

    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}
