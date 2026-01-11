import { useEffect, useRef } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';

/**
 * Hook to subscribe to WebSocket events
 * @param {string} eventType - The type of event to listen for (e.g., 'like_update', 'aura_point_update')
 * @param {function} callback - Function to call when event is received
 */
export const useWebSocket = (eventType, callback) => {
    const { subscribe } = useWebSocketContext();
    const savedCallback = useRef(callback);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        // Create a stable callback wrapper that calls the current ref
        const handler = (data) => {
            if (savedCallback.current) {
                savedCallback.current(data);
            }
        };

        const unsubscribe = subscribe(eventType, handler);
        return () => {
            unsubscribe();
        };
    }, [eventType, subscribe]);
};
