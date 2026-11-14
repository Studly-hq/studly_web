import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Gift,
    Ticket,
    Calendar,
    Users,
    CheckCircle,
    Clock,
    Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/common/SEO";
import client from "../api/client";

const Giveaway = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [giveawayStatus, setGiveawayStatus] = useState(null);

    // Fetch giveaway status (admin only endpoint, but we'll try)
    const fetchGiveawayStatus = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            const response = await client.get("/giveaway/today-status");
            setGiveawayStatus(response.data);
        } catch (err) {
            // Non-admin users get 403, that's fine
            if (err.response?.status !== 403) {
                console.error("Failed to fetch giveaway status:", err);
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchGiveawayStatus();
    }, [fetchGiveawayStatus]);

    if (!isAuthenticated) {
        return null; // AuthGate handles redirect
    }

    return (
        <div className="w-full max-w-[640px] mx-auto min-h-screen bg-reddit-bg pb-24">
            <SEO
                title="Today's Giveaway - Every 5th Login Wins!"
                description="Sign in today for a chance to win! Every 5th login gets a movie ticket (8 tickets total)."
                canonical="/giveaway"
            />
            
            {/* Header */}
            <div className="sticky top-0 z-30 bg-reddit-bg/95 backdrop-blur-md border-b border-reddit-border px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-reddit-cardHover rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-reddit-text" />
                </button>
                <div className="flex-1"></div>
                <div className="flex items-center gap-2 bg-reddit-orange/10 text-reddit-orange px-3 py-1 rounded-full text-sm font-bold">
                    <Gift size={14} />
                    <span>Today Only</span>
                </div>
            </div>

            <div className="px-4 pt-6">
                {/* Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-reddit-orange/20 via-reddit-card to-reddit-card border border-reddit-border rounded-3xl p-6 md:p-8 mb-6"
                >
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-reddit-orange/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                    
                    <div className="relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-reddit-orange to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-reddit-orange/30"
                        >
                            <Ticket size={40} className="text-white" />
                        </motion.div>
                        
                        <h1 className="text-3xl md:text-4xl font-black text-reddit-text mb-2 font-righteous tracking-tight">
                            Today's Movie Ticket Giveaway
                        </h1>
                        
                        <p className="text-reddit-textMuted text-lg mb-4 max-w-md mx-auto">
                            <span className="font-bold text-reddit-orange">Every 5th login</span> wins a movie ticket! 
                            <span className="font-bold text-reddit-orange">8 tickets total</span> — first come, first served.
                        </p>
                        
                        {/* Live Counter if available */}
                        {giveawayStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap items-center justify-center gap-3 text-sm"
                            >
                                <div className="flex items-center gap-2 bg-reddit-bg/50 backdrop-blur px-4 py-2 rounded-full border border-reddit-border">
                                    <Users size={16} className="text-reddit-orange" />
                                    <span className="font-bold text-reddit-text">
                                        {giveawayStatus.login_count} / 40 logins
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-reddit-bg/50 backdrop-blur px-4 py-2 rounded-full border border-reddit-border">
                                    <Ticket size={16} className="text-yellow-500" />
                                    <span className="font-bold text-reddit-text">
                                        {giveawayStatus.winners_claimed} / 8 tickets claimed
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-reddit-bg/50 backdrop-blur px-4 py-2 rounded-full border border-reddit-border">
                                    <Award size={16} className="text-reddit-orange" />
                                    <span className="font-bold text-reddit-text">
                                        {giveawayStatus.logins_remaining} logins left
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* How it works */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-reddit-text mb-4 flex items-center gap-2">
                        <Gift size={22} className="text-reddit-orange" />
                        How It Works
                    </h2>
                    
                    <div className="space-y-3">
                        {[
                            { 
                                step: 1, 
                                icon: Calendar, 
                                title: "Sign In Today", 
                                desc: "Log into your Studly account today to enter the giveaway" 
                            },
                            { 
                                step: 2, 
                                icon: Users, 
                                title: "Every 5th Login Wins", 
                                desc: "Login positions 5, 10, 15, 20, 25, 30, 35, 40 win automatically" 
                            },
                            { 
                                step: 3, 
                                icon: CheckCircle, 
                                title: "Instant Win Notification", 
                                desc: "If you're a winner, a celebration modal appears immediately on login!" 
                            },
                            { 
                                step: 4, 
                                icon: Ticket, 
                                title: "Claim Your Ticket", 
                                desc: "DM t.me/zee_mp4 on Telegram within 48 hours to claim your movie ticket" 
                            },
                        ].map((item) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: item.step * 0.1 }}
                                className="flex items-start gap-4 p-4 bg-reddit-card border border-reddit-border rounded-2xl group hover:border-reddit-orange/30 transition-colors"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-reddit-orange/10 text-reddit-orange flex items-center justify-center group-hover:bg-reddit-orange group-hover:text-white transition-colors">
                                    <item.icon size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black text-reddit-orange bg-reddit-orange/10 px-2 py-0.5 rounded-full">
                                            Step {item.step}
                                        </span>
                                        <h3 className="font-bold text-reddit-text">{item.title}</h3>
                                    </div>
                                    <p className="text-reddit-textMuted text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Winning Positions Visual */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-reddit-text mb-4 flex items-center gap-2">
                        <Award size={20} className="text-yellow-500" />
                        Winning Login Positions
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[5, 10, 15, 20, 25, 30, 35, 40].map((pos, idx) => (
                            <motion.div
                                key={pos}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex flex-col items-center justify-center text-center"
                            >
                                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Login</span>
                                <span className="font-black text-2xl md:text-3xl text-amber-500">{pos}</span>
                                <span className="text-[10px] font-bold text-yellow-500">Ticket #{idx + 1}</span>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-reddit-textMuted mt-3">
                        Only 40 logins total today — once all 8 tickets are claimed, the giveaway ends!
                    </p>
                </div>

                {/* Today's Winners (if available) */}
                {giveawayStatus?.winners?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-reddit-card border border-reddit-border rounded-2xl p-6 mb-6"
                    >
                        <h2 className="text-lg font-bold text-reddit-text mb-4 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-500" />
                            Today's Winners So Far
                        </h2>
                        <div className="space-y-2">
                            {giveawayStatus.winners.map((winner, idx) => (
                                <motion.div
                                    key={winner.user_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-reddit-bg border border-reddit-border"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        #{winner.ticket_number}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-reddit-text text-sm">@{winner.username}</p>
                                        <p className="text-[10px] text-reddit-textMuted">
                                            Login #{winner.login_position} • Ticket #{winner.ticket_number}
                                        </p>
                                    </div>
                                    <div className="text-green-500 font-bold">
                                        <CheckCircle size={18} fill="currentColor" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center p-6 bg-gradient-to-r from-reddit-orange/10 to-yellow-500/10 border border-reddit-orange/20 rounded-2xl"
                >
                    <p className="text-reddit-textMuted mb-2">
                        Haven't signed in today? You're missing your chance!
                    </p>
                    <p className="font-bold text-reddit-text mb-3">
                        {giveawayStatus?.is_active ? (
                            <>
                                <span className="text-reddit-orange">{giveawayStatus.logins_remaining}</span> logins until giveaway ends
                            </>
                        ) : (
                            'Giveaway ended for today'
                        )}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-reddit-orange">
                        <Clock size={16} />
                        <span>Resets at midnight UTC • One ticket per user</span>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-xs text-reddit-textMuted">
                    <p>No purchase necessary. Winners determined by login order (every 5th login).</p>
                    <p className="mt-1">Movie tickets subject to availability. DM t.me/zee_mp4 to claim within 48 hours.</p>
                    <p className="mt-1">One ticket per user. 8 tickets total for today only.</p>
                </div>
            </div>
        </div>
    );
};

export default Giveaway;