import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from "../utils/supabase";

const WebSocketContext = createContext();

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    // Track if disconnection was intentional to prevent unwanted reconnections
    const isIntentionalDisconnect = useRef(false);

    // Store subscribers in a ref to avoid re-creating socket on subscriber change
    const subscribersRef = useRef({});

    // Reconnection state
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const BASE_RECONNECT_DELAY = 1000;

    const connect = useCallback(async (tokenProp) => {
        let token = tokenProp;
        if (!token) {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                token = session?.access_token;
            } catch (err) {
                console.warn("WS: Failed to get session", err);
            }
        }

        if (!token) {
            console.warn("WS: No token found, skipping connection");
            return;
        }

        isIntentionalDisconnect.current = false;

        // Use localhost:8080 as per guide
        const wsUrl = 'wss://unesthetic-cretaceously-maris.ngrok-free.dev/ws';

        console.log('Connecting to WebSocket:', wsUrl);
        // Clean up existing socket if any before connecting a new one, just in case
        setSocket((prevSocket) => {
            if (prevSocket) {
                prevSocket.close();
            }
            return null;
        });

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket Connected, sending AUTH...');
            if (token) {
                ws.send(JSON.stringify({ type: 'AUTH', token }));
            }
            setIsConnected(true);
            setConnectionError(null);
            reconnectAttemptsRef.current = 0;
        };

        ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                const { type, data } = payload;

                // Notify subscribers for this event type
                if (subscribersRef.current[type]) {
                    subscribersRef.current[type].forEach(callback => callback(data));
                }
            } catch (error) {
                console.warn('WS: Non-JSON message received', event.data);
            }
        };

        ws.onclose = (event) => {
            console.log('WebSocket Disconnected', event.code, event.reason);
            setIsConnected(false);
            setSocket(null);

            // Attempt reconnection if not intentional and not clean
            if (!isIntentionalDisconnect.current && !event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                const delay = Math.min(10000, BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current));
                console.log(`Reconnecting in ${delay}ms... (Attempt ${reconnectAttemptsRef.current + 1})`);
                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnectAttemptsRef.current += 1;
                    // Try to get fresh token if we can, otherwise use what we have (needs logic in callsite ideally)
                    // For now, we will just reconnect. Caller should handle "auth_failed" close if possible.
                    // But here we don't have the token stored in this scope easily unless we use a Ref or check localStorage.
                    // The plan says: "Reconnect with fresh token on auth failure".
                    // Best way: read from localStorage here.
                    // Reconnect using fresh session logic inside connect()
                    connect();
                }, delay);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setConnectionError(error);
        };

        setSocket(ws);
    }, []);

    // Ref to access current socket in disconnect without closure state issues if needed,
    // though using the state or closure is fine if dependencies are right.
    // For simplicity, we just close the socket in state.

    // We'll use a ref to hold the socket instance for reliable cleanup
    const socketRef = useRef(null);
    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    const disconnect = useCallback(() => {
        isIntentionalDisconnect.current = true;

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (socketRef.current) {
            socketRef.current.close();
        }
        setSocket(null);
        setIsConnected(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isIntentionalDisconnect.current = true;
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    // Subscription management
    const subscribe = useCallback((eventType, callback) => {
        if (!subscribersRef.current[eventType]) {
            subscribersRef.current[eventType] = new Set();
        }
        subscribersRef.current[eventType].add(callback);

        // Return unsubscribe function
        return () => {
            if (subscribersRef.current[eventType]) {
                subscribersRef.current[eventType].delete(callback);
                if (subscribersRef.current[eventType].size === 0) {
                    delete subscribersRef.current[eventType];
                }
            }
        };
    }, []);

    const value = {
        isConnected,
        connectionError,
        subscribe,
        connect,
        disconnect
    };

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};
