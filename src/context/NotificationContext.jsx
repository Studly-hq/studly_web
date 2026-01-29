import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocketContext } from './WebSocketContext';
import { getNotifications, markNotificationsRead } from '../api/contents';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { subscribe } = useWebSocketContext();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();

            const unsubscribe = subscribe('notification', (wsNotif) => {
                // Normalize WebSocket payload to match API response shape
                const normalizedNotif = {
                    id: wsNotif.id,
                    type: wsNotif.notification_type,
                    content: wsNotif.content,
                    is_read: false,
                    created_at: wsNotif.created_at,
                    post_id: wsNotif.post_id,
                    comment_id: wsNotif.comment_id,
                    actor: {
                        user_id: wsNotif.actor_id,
                        username: wsNotif.actor_username,
                        avatar_url: wsNotif.actor_avatar,
                    }
                };

                setNotifications(prev => [normalizedNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
            });

            return () => unsubscribe();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAuthenticated, fetchNotifications, subscribe]);

    const markAllRead = useCallback(async () => {
        try {
            await markNotificationsRead([]);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    }, []);

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAllRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
