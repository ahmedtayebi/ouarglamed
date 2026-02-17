// PATH: src/components/StudyZone/PomodoroTimer.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const MODES = {
    pomodoro: { id: 'pomodoro', label: 'طماطم 🍅', minutes: 25, color: '#ef4444' }, // red-500
    shortBreak: { id: 'shortBreak', label: 'استراحة قصيرة ☕', minutes: 5, color: '#14b8a6' }, // teal-500
    longBreak: { id: 'longBreak', label: 'استراحة طويلة 🌙', minutes: 15, color: '#6366f1' }, // indigo-500
};

const PomodoroTimer = () => {
    const [mode, setMode] = useState('pomodoro');
    const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessions, setSessions] = useState(0); // Completed pomodoros
    const [soundEnabled, setSoundEnabled] = useState(true);

    const timerRef = useRef(null);
    const audioContextRef = useRef(null);

    // Initialize/Load state
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('medguid-pomodoro') || '{}');
        if (saved.sessions) setSessions(saved.sessions);
    }, []);

    // Save sessions
    useEffect(() => {
        const current = JSON.parse(localStorage.getItem('medguid-pomodoro') || '{}');
        localStorage.setItem('medguid-pomodoro', JSON.stringify({ ...current, sessions }));
    }, [sessions]);

    // Audio Beeper
    const playBeep = useCallback(() => {
        if (!soundEnabled) return;
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error('Audio play failed', e);
        }
    }, [soundEnabled]);

    // Timer Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);

                // Update global stats every minute (approx)
                if (timeLeft % 60 === 0) {
                    const stats = JSON.parse(localStorage.getItem('medguid-stats') || '{}');
                    stats.minutes = (stats.minutes || 0) + 1;
                    localStorage.setItem('medguid-stats', JSON.stringify(stats));
                    window.dispatchEvent(new Event('medguid-stats-updated'));
                }
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            setIsActive(false);
            playBeep();
            if (mode === 'pomodoro') {
                setSessions((s) => s + 1);
                // Dispatch session update
                const stats = JSON.parse(localStorage.getItem('medguid-stats') || '{}');
                stats.sessions = (stats.sessions || 0) + 1;
                localStorage.setItem('medguid-stats', JSON.stringify(stats));
                window.dispatchEvent(new Event('medguid-stats-updated'));
            }
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, mode, playBeep]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].minutes * 60);
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].minutes * 60);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Circular Progress
    const totalTime = MODES[mode].minutes * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="bg-white/5 dark:bg-navy-800/40 border border-white/10 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
            {/* Sound Toggle */}
            <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 text-navy-400"
            >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Mode Toggles */}
            <div className="flex gap-2 mb-8 bg-black/10 dark:bg-black/20 p-1 rounded-xl">
                {Object.values(MODES).map((m) => (
                    <button
                        key={m.id}
                        onClick={() => changeMode(m.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
              ${mode === m.id
                                ? 'bg-white text-navy-900 shadow-sm'
                                : 'text-navy-500 dark:text-navy-400 hover:text-white'}`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            {/* Timer Circle */}
            <div className="relative mb-8">
                <svg width="200" height="200" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-navy-100 dark:text-navy-700"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke={MODES[mode].color}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-navy-900 dark:text-white font-mono">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm font-medium" style={{ color: MODES[mode].color }}>
                        {isActive ? 'جاري التركيز...' : 'متوقف'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={toggleTimer}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                    style={{ backgroundColor: MODES[mode].color }}
                >
                    {isActive ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 text-navy-900 dark:text-white hover:bg-white/20 transition-colors"
                >
                    <RotateCcw size={22} />
                </button>
            </div>

            {/* Session Counter */}
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-navy-500 dark:text-navy-400">
                <span>الجلسات المكتملة: {sessions}</span>
                <div className="flex gap-1">
                    {Array.from({ length: Math.min(sessions, 4) }).map((_, i) => (
                        <span key={i}>🍅</span>
                    ))}
                    {sessions > 4 && <span>+</span>}
                </div>
            </div>

            {sessions > 0 && sessions % 4 === 0 && mode === 'pomodoro' && timeLeft === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow-lg"
                >
                    أنجزت 4 بومودورو! خذ استراحة طويلة 🎉
                </motion.div>
            )}
        </div>
    );
};

export default PomodoroTimer;
