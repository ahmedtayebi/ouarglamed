// PATH: src/components/StudyZone/StudyStats.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Target } from 'lucide-react';

const StudyStats = () => {
    const [stats, setStats] = useState({
        sessions: 0,
        minutes: 0,
        streak: 0,
        lastActive: null
    });

    useEffect(() => {
        // Load stats from local storage
        const savedStats = JSON.parse(localStorage.getItem('medguid-stats') || '{}');
        const today = new Date().toDateString();

        // Check if new day
        if (savedStats.lastActive !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const isConsecutive = savedStats.lastActive === yesterday.toDateString();

            const newStats = {
                sessions: 0,
                minutes: 0,
                streak: isConsecutive ? (savedStats.streak || 0) + 1 : (savedStats.lastActive ? 1 : 1), // Reset streak if missed, else keep/increment
                lastActive: today // Mark as active today on first load? Or wait for first action? 
                // For simpler logic, we'll mark active on visit for streak purposes, but maybe only increment streak if they did something yesterday?
                // Let's simplified: Streak increments if lastActive was yesterday. If lastActive was today, keep same. If older, reset to 1.
            };

            if (savedStats.lastActive === today) {
                // Same day reload, keep current
                setStats(savedStats);
            } else {
                // New day
                const lastDate = savedStats.lastActive ? new Date(savedStats.lastActive) : null;
                let currentStreak = 1;

                if (lastDate) {
                    const diffTime = Math.abs(new Date(today) - lastDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays <= 1) {
                        currentStreak = (savedStats.streak || 0); // Don't increment yet? Or just keep it?
                        // Let's say streak is "days visited".
                        if (diffDays === 1) currentStreak += 1;
                    }
                }

                const finalStats = {
                    sessions: 0,
                    minutes: 0,
                    streak: currentStreak,
                    lastActive: today
                };

                // Only save/update if verified action? No, let's auto-save initial state for today
                localStorage.setItem('medguid-stats', JSON.stringify(finalStats));
                setStats(finalStats);
            }
        } else {
            setStats(savedStats);
        }

        // Listen for storage updates (from Pomodoro)
        const handleStorageChange = () => {
            const updated = JSON.parse(localStorage.getItem('medguid-stats') || '{}');
            if (updated.lastActive) setStats(updated);
        };

        window.addEventListener('storage', handleStorageChange);
        // Custom event listener for same-window updates
        window.addEventListener('medguid-stats-updated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('medguid-stats-updated', handleStorageChange);
        };
    }, []);

    const goalMinutes = 120; // 2 hours goal
    const progress = Math.min((stats.minutes / goalMinutes) * 100, 100);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sessions */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 dark:bg-navy-800/40 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
            >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Target size={24} />
                </div>
                <div>
                    <p className="text-2xl font-black text-navy-900 dark:text-white">
                        {stats.sessions}
                    </p>
                    <p className="text-xs text-navy-500 dark:text-navy-400 font-medium">جلسات اليوم</p>
                </div>
            </motion.div>

            {/* Minutes */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 dark:bg-navy-800/40 border border-white/10 rounded-2xl p-5 relative overflow-hidden"
            >
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-navy-900 dark:text-white">
                            {stats.minutes} <span className="text-sm font-normal text-navy-500 dark:text-navy-400">د</span>
                        </p>
                        <p className="text-xs text-navy-500 dark:text-navy-400 font-medium">وقت التركيز</p>
                    </div>
                </div>
                {/* Progress bar background */}
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500/20 w-full">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </motion.div>

            {/* Streak */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 dark:bg-navy-800/40 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
            >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Flame size={24} className={stats.streak > 0 ? "animate-pulse" : ""} />
                </div>
                <div>
                    <p className="text-2xl font-black text-navy-900 dark:text-white">
                        {stats.streak} <span className="text-sm font-normal text-navy-500 dark:text-navy-400">أيام</span>
                    </p>
                    <p className="text-xs text-navy-500 dark:text-navy-400 font-medium">سلسلة الالتزام</p>
                </div>
            </motion.div>
        </div>
    );
};

export default StudyStats;
