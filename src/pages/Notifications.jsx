import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Heart, MessageSquare, Bookmark, UserPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext"; // New import
import LoadingSpinner from "../components/common/LoadingSpinner";
import { toast } from "sonner";

const Notifications = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { notifications, loading, markAllRead } = useNotifications(); // Refactored to use NotificationContext

    useEffect(() => {
        if (isAuthenticated && notifications.some(n => !n.is_read)) {
            // Automatically mark all as read when viewing the notifications page
            markAllRead();
        }
    }, [isAuthenticated, notifications, markAllRead]);

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        return postDate.toLocaleDateString();
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllRead();
            toast.success("All notifications marked as read");
        } catch (err) {
            toast.error("Failed to mark notifications");
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "like": return <Heart size={16} className="text-red-500 fill-red-500" />;
            case "comment": return <MessageSquare size={16} className="text-blue-500 fill-blue-500" />;
            case "save": return <Bookmark size={16} className="text-reddit-orange fill-reddit-orange" />;
            case "follow": return <UserPlus size={16} className="text-green-500" />;
            default: return <Bell size={16} className="text-reddit-textMuted" />;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-reddit-bg flex flex-col items-center justify-center p-4">
                <Bell size={64} className="text-reddit-textMuted/20 mb-4" />
                <h1 className="text-2xl font-bold text-reddit-text mb-2">Login to see notifications</h1>
                <p className="text-reddit-textMuted mb-6">Stay updated with likes, comments and follows</p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-reddit-orange text-white px-8 py-2 rounded-full font-bold"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-reddit-bg text-reddit-text">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-reddit-cardHover rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold">Notifications</h1>
                    </div>
                    {notifications.some(n => !n.is_read) && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-sm font-bold text-reddit-orange hover:underline"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <LoadingSpinner size={40} color="#FF4500" />
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-reddit-border">
                        {notifications.map((notif) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={notif.id}
                                className={`p-4 flex gap-4 hover:bg-reddit-cardHover transition-colors cursor-pointer ${!notif.is_read ? 'bg-reddit-orange/5' : ''}`}
                                onClick={() => {
                                    if (notif.post_id) {
                                        navigate(`/post/${notif.post_id}`);
                                    }
                                }}
                            >
                                <div className="relative">
                                    <img
                                        src={notif.actor?.avatar || notif.actor?.avatar_url || notif.user?.avatar || "https://i.pravatar.cc/150"}
                                        alt=""
                                        className="w-12 h-12 rounded-full object-cover border border-reddit-border"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-reddit-card rounded-full p-1 border border-reddit-border">
                                        {getIcon(notif.type)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold hover:underline">@{notif.actor?.username || notif.user?.username || "user"}</span>
                                        <span className="text-xs text-reddit-textMuted">• {formatTimestamp(notif.created_at || Date.now())}</span>
                                    </div>
                                    <p className="text-reddit-text/90 text-[15px]">{notif.content}</p>
                                </div>
                                {!notif.is_read && (
                                    <div className="w-2 h-2 bg-reddit-orange rounded-full mt-2" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-reddit-cardHover flex items-center justify-center">
                            <Bell size={32} className="opacity-20" />
                        </div>
                        <h3 className="font-bold text-xl">No notifications yet</h3>
                        <p className="text-reddit-textMuted max-w-xs mx-auto">
                            When people like your posts, comment or follow you, it will show up here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
