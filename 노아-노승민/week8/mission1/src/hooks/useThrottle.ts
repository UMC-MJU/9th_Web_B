import { useEffect, useRef, useState } from "react";

export default function useThrottle<T>(value: T, limit: number = 1000) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (now - lastRan.current >= limit) {
      // 바로 실행 가능
      setThrottledValue(value);
      lastRan.current = now;
    } else {
      // 남은 시간만큼 기다렸다가 실행
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }, limit - (now - lastRan.current));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, limit]);

  return throttledValue;
}
