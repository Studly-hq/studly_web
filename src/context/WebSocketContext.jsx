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
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    const activeTokenRef = useRef(null);
    const socketRef = useRef(null);

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

        // Prevent redundant connection attempts if we're already connecting/connected with this token
        if (activeTokenRef.current === token && (socketRef.current?.readyState === WebSocket.CONNECTING || socketRef.current?.readyState === WebSocket.OPEN)) {
            return;
        }

        activeTokenRef.current = token;
        isIntentionalDisconnect.current = false;

        // Clean up existing socket if any before connecting a new one
        if (socketRef.current) {
            const currentSocket = socketRef.current;
            // Only close if not already closing/closed
            if (currentSocket.readyState !== WebSocket.CLOSING && currentSocket.readyState !== WebSocket.CLOSED) {
                // If it's CONNECTING, closing it might trigger the console error, 
                // but since we check activeTokenRef above, we should rarely hit this.
                currentSocket.close();
            }
            socketRef.current = null;
        }

        const wsUrl = 'wss://studly-server-production.up.railway.app/ws';
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
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

                if (subscribersRef.current[type]) {
                    subscribersRef.current[type].forEach(callback => callback(data));
                }
            } catch (error) {
                console.warn('WS: Non-JSON message received', event.data);
            }
        };

        ws.onclose = (event) => {
            setIsConnected(false);
            if (socketRef.current === ws) {
                socketRef.current = null;
                activeTokenRef.current = null;
            }

            if (!isIntentionalDisconnect.current && !event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                const delay = Math.min(10000, BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current));
                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnectAttemptsRef.current += 1;
                    connect();
                }, delay);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setConnectionError(error);
        };

    }, []);

    const disconnect = useCallback(() => {
        isIntentionalDisconnect.current = true;
        activeTokenRef.current = null;

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (socketRef.current) {
            if (socketRef.current.readyState !== WebSocket.CLOSING && socketRef.current.readyState !== WebSocket.CLOSED) {
                socketRef.current.close();
            }
            socketRef.current = null;
        }
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
