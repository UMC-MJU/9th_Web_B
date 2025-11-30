import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value: T, interval: number) {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecutedRef = useRef<number>(Date.now());

    useEffect(() => {
        const now = Date.now();
        const remaining = interval - (now - lastExecutedRef.current);

        if (remaining <= 0) {
            setThrottledValue(value);
            lastExecutedRef.current = now;
            return;
        }

        const timeoutId = setTimeout(() => {
            setThrottledValue(value);
            lastExecutedRef.current = Date.now();
        }, remaining);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, interval]);

    return throttledValue;
}
