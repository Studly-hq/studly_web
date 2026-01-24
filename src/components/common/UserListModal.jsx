import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const UserListModal = ({ isOpen, onClose, title, users, loading }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-reddit-card border border-reddit-border rounded-xl w-full max-w-md overflow-hidden max-h-[80vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-reddit-border">
                        <h3 className="text-lg font-bold text-reddit-text">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-reddit-cardHover rounded-full transition-colors"
                        >
                            <X size={20} className="text-reddit-textMuted" />
                        </button>
                    </div>

                    {/* User List */}
                    <div className="overflow-y-auto p-2 flex-1 min-h-[200px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-full py-10">
                                <LoadingSpinner size={24} color="#FF4500" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-10 text-reddit-textMuted">
                                <p>No users found</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {users.map((user) => (
                                    <div
                                        key={user.id || user.user_id}
                                        onClick={() => {
                                            onClose();
                                            navigate(`/profile/${user.username}`);
                                        }}
                                        className="flex items-center gap-3 p-2 hover:bg-reddit-cardHover rounded-lg cursor-pointer transition-colors"
                                    >
                                        {user.avatar || user.avatar_url ? (
                                            <img
                                                src={user.avatar || user.avatar_url}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-reddit-cardHover flex items-center justify-center border border-reddit-border">
                                                <User size={20} className="text-reddit-textMuted" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-reddit-text text-sm">
                                                {user.name || user.displayName || user.username}
                                            </p>
                                            <p className="text-xs text-reddit-textMuted">@{user.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UserListModal;
