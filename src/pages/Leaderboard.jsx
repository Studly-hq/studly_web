import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy,
    User,
    ArrowLeft,
    Flame,
    Award,
    Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../api/coursebank";
import { useAuth } from "../context/AuthContext";

const Leaderboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [activePeriod, setActivePeriod] = useState("overall");
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const periods = [
        { id: "daily", label: "Daily" },
        { id: "weekly", label: "Weekly" },
        { id: "overall", label: "Overall" }
    ];

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getLeaderboard(activePeriod);
                setLeaderboardData(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Unable to load leaderboard. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [activePeriod]);

    // Handle Loading State
    if (loading && leaderboardData.length === 0) {
        return (
            <div className="max-w-[640px] mx-auto min-h-screen pt-4 px-4 bg-reddit-bg overflow-hidden">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-reddit-card rounded w-48 mb-6" />
                    <div className="flex gap-2 mb-8">
                        <div className="h-10 bg-reddit-card rounded flex-1" />
                        <div className="h-10 bg-reddit-card rounded flex-1" />
                        <div className="h-10 bg-reddit-card rounded flex-1" />
                    </div>
                    <div className="h-64 bg-reddit-card rounded-2xl mb-6" />
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 bg-reddit-card rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const topThree = leaderboardData.slice(0, 3);
    const remainingRanks = leaderboardData.slice(3);
    const userEntry = leaderboardData.find(entry => entry.user_id === currentUser?.id);

    return (
        <div className="max-w-[640px] mx-auto min-h-screen bg-reddit-bg pb-24">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-reddit-bg/95 backdrop-blur-md border-b border-reddit-border px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-reddit-cardHover rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-reddit-text" />
                </button>
                <h1 className="text-xl font-bold text-reddit-text font-righteous tracking-wide flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={24} />
                    Student Leaderboard
                </h1>
            </div>

            <div className="px-4 pt-6">
                {/* Period Selector - Modern Segmented Control */}
                <div className="flex p-1 bg-reddit-card border border-reddit-border rounded-xl mb-10">
                    {periods.map((period) => (
                        <button
                            key={period.id}
                            onClick={() => setActivePeriod(period.id)}
                            className={`relative flex-1 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg ${activePeriod === period.id
                                ? "text-white"
                                : "text-reddit-textMuted hover:text-reddit-text hover:bg-reddit-cardHover/50"
                                }`}
                        >
                            {activePeriod === period.id && (
                                <motion.div
                                    layoutId="activePeriod"
                                    className="absolute inset-0 bg-reddit-orange rounded-lg shadow-[0_0_15px_rgba(255,69,0,0.3)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{period.label}</span>
                        </button>
                    ))}
                </div>

                {/* Podium for Top 3 */}
                {!error && topThree.length > 0 && (
                    <div className="flex items-end justify-center gap-2 mb-12 mt-4 px-2">
                        {/* Rank 2 */}
                        {topThree[1] && (
                            <PodiumPlace
                                entry={topThree[1]}
                                place={2}
                                height="h-32"
                                color="bg-slate-400"
                                delay={0.2}
                            />
                        )}
                        {/* Rank 1 */}
                        {topThree[0] && (
                            <PodiumPlace
                                entry={topThree[0]}
                                place={1}
                                height="h-44"
                                color="bg-yellow-500"
                                isFirst
                                delay={0}
                            />
                        )}
                        {/* Rank 3 */}
                        {topThree[2] && (
                            <PodiumPlace
                                entry={topThree[2]}
                                place={3}
                                height="h-24"
                                color="bg-amber-700"
                                delay={0.4}
                            />
                        )}
                    </div>
                )}

                {/* Rankings List */}
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {remainingRanks.map((entry, index) => (
                            <motion.div
                                key={entry.user_id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-center gap-4 p-4 rounded-2xl glass transition-all duration-300 ${entry.user_id === currentUser?.id ? "border-reddit-orange/50 bg-reddit-orange/5" : ""
                                    }`}
                            >
                                <div className="w-8 text-center font-bold text-reddit-textMuted text-sm">
                                    {entry.rank}
                                </div>

                                <div className="relative group cursor-pointer" onClick={() => navigate(`/profile/${entry.username}`)}>
                                    {entry.avatar_url ? (
                                        <img
                                            src={entry.avatar_url}
                                            alt={entry.display_name}
                                            className="w-10 h-10 rounded-full object-cover border border-reddit-border"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-reddit-cardHover flex items-center justify-center border border-reddit-border">
                                            <User size={20} className="text-reddit-textMuted" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0" onClick={() => navigate(`/profile/${entry.username}`)}>
                                    <h3 className="font-bold text-reddit-text truncate group-hover:text-reddit-orange transition-colors">
                                        {entry.display_name}
                                    </h3>
                                    <p className="text-xs text-reddit-textMuted truncate">@{entry.username}</p>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-reddit-orange font-bold">
                                        <span>{entry.points}</span>
                                        <Flame size={14} fill="currentColor" />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-wider text-reddit-textMuted font-bold">Aura</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {leaderboardData.length === 0 && !loading && !error && (
                        <div className="text-center py-20 bg-reddit-card/50 rounded-3xl border border-dashed border-reddit-border">
                            <Award size={48} className="mx-auto text-reddit-textMuted mb-4 opacity-20" />
                            <p className="text-reddit-textMuted">No rankings available for this period yet.</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20 text-red-400">
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating My Rank Card */}
            {userEntry && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-20 xl:bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] z-40"
                >
                    <div className="bg-[#1A1A1B] border border-reddit-orange/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex items-center gap-4 ring-1 ring-reddit-orange/20">
                        <div className="w-10 h-10 bg-reddit-orange rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-reddit-orange/20">
                            #{userEntry.rank}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] uppercase font-bold text-reddit-textMuted tracking-widest">Your Ranking</p>
                            <h4 className="font-bold text-base text-white">Keep going, {currentUser?.displayName}!</h4>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-reddit-orange leading-none">{userEntry.points}</div>
                            <div className="text-[10px] font-bold text-reddit-textMuted uppercase tracking-tighter">Points</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const PodiumPlace = ({ entry, place, height, color, isFirst, delay }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            className={`flex flex-col items-center flex-1 max-w-[120px]`}
        >
            <div
                className="relative group cursor-pointer mb-4"
                onClick={() => navigate(`/profile/${entry.username}`)}
            >
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 ${isFirst ? 'scale-125' : ''}`}>
                    {isFirst ? (
                        <Crown className="text-yellow-500" fill="currentColor" size={28} />
                    ) : (
                        <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-[10px] font-bold text-black`}>
                            {place}
                        </div>
                    )}
                </div>
                {entry.avatar_url ? (
                    <img
                        src={entry.avatar_url}
                        alt={entry.display_name}
                        className={`rounded-full object-cover border-4 ${isFirst ? 'w-16 h-16 md:w-20 md:h-20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'w-12 h-12 md:w-16 md:h-16 border-reddit-border'}`}
                    />
                ) : (
                    <div className={`rounded-full bg-reddit-cardHover flex items-center justify-center border-4 ${isFirst ? 'w-16 h-16 md:w-20 md:h-20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'w-12 h-12 md:w-16 md:h-16 border-reddit-border'}`}>
                        <User size={isFirst ? 32 : 24} className="text-reddit-textMuted" />
                    </div>
                )}
            </div>

            <div className="text-center mb-4 w-full px-1">
                <p className="text-sm font-bold text-reddit-text truncate">{entry.display_name}</p>
                <div className="flex items-center justify-center gap-1 text-reddit-orange">
                    <span className="text-xs font-black">{entry.points}</span>
                    <Flame size={12} fill="currentColor" />
                </div>
            </div>

            <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
                className={`w-full ${color} rounded-t-2xl relative overflow-hidden group shadow-lg`}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-4 text-center font-black text-black/20 text-4xl select-none">
                    {place}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Leaderboard;
