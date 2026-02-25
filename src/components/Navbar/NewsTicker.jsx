// PATH: src/components/Navbar/NewsTicker.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import newsData from '@data/newsData';

/**
 * News ticker banner with RTL marquee animation.
 * Urgent items display in amber, normal in teal.
 * Pauses on hover.
 */
const NewsTicker = () => {
    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // ADDED: Show ticker after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000); // MODIFIED: ticker now waits 3 seconds before appearing
        return () => clearTimeout(timer);
    }, []);

    if (!newsData?.length) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="fixed top-[76px] left-0 right-0 z-40 
        bg-navy-900/90 dark:bg-navy-950/95 backdrop-blur-sm
        border-b border-white/5 overflow-hidden h-9
        flex items-center"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    role="marquee"
                    aria-label="آخر الأخبار"
                >
                    <div
                        className="flex whitespace-nowrap"
                        style={{
                            animation: `ticker 60s linear infinite`, // MODIFIED: slowed ticker speed for readability
                            animationPlayState: isPaused ? 'paused' : 'running',
                            animationDirection: 'reverse',
                        }}
                    >
                        {[...newsData, ...newsData].map((item, index) => (
                            <span
                                key={`${item.id}-${index}`}
                                className={`inline-flex items-center gap-2 px-8 text-sm font-medium
              ${item.isUrgent
                                        ? 'text-amber-400'
                                        : 'text-primary-400'
                                    }`}
                            >
                                {item.isUrgent && (
                                    <AlertTriangle size={14} className="shrink-0" aria-hidden="true" />
                                )}
                                {item.text}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NewsTicker;
