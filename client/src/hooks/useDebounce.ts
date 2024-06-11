import { useState, useEffect } from 'react';

export const useDebounce = (fn: (...args: any) => void, delay: number) => {
    const [debounceValue, setDebounceValue] = useState<(...args: any) => void>(fn);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(fn);
        }, delay);
        
        return () => {
            clearTimeout(handler);
        };
    }, [fn, delay]);
    return debounceValue;
}