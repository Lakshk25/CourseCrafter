import { useEffect, useState } from 'react'

// use debounce for search bcoz when user write search query every time they type db get calls to stop db calls for every word  debounce the search
// so db call after delay of 500ms if user stops typing
export function useDebounce<T>(value: T, delay?:number): T{
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay || 500);

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);

    return debouncedValue;
};