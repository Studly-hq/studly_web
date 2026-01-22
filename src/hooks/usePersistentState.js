import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook to persist state to localStorage.
 * Updates state when the key changes to reflect stored value for the new key.
 * 
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no data is found in storage
 * @returns {[any, Function]} - The state and setter function
 */
export const usePersistentState = (key, initialValue) => {
    const [state, setState] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Ref to track if it's the first render to avoid redundant updates check
    const isFirstRender = useRef(true);

    // Update state if key changes (e.g. switching between posts)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        try {
            const item = localStorage.getItem(key);
            if (item) {
                setState(JSON.parse(item));
            } else {
                setState(initialValue);
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}" on change:`, error);
            setState(initialValue);
        }
    }, [key, initialValue]);

    // specific useEffect to write to storage
    useEffect(() => {
        try {
            if (state === undefined) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
};
