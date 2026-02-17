// PATH: src/components/UI/ProgressBar.jsx

import { motion } from 'framer-motion';

/**
 * Animated progress bar with color thresholds.
 * @param {{ percentage: number, className?: string }} props
 */
const ProgressBar = ({ percentage = 0, className = '' }) => {
    const getColor = () => {
        if (percentage <= 33) return 'bg-red-500';
        if (percentage <= 66) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getGlow = () => {
        if (percentage <= 33) return 'shadow-red-500/30';
        if (percentage <= 66) return 'shadow-amber-500/30';
        return 'shadow-emerald-500/30';
    };

    return (
        <div
            className={`w-full h-2 bg-navy-800/30 dark:bg-navy-700/50 rounded-full overflow-hidden ${className}`}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percentage}% مكتمل`}
        >
            <motion.div
                className={`h-full rounded-full ${getColor()} shadow-lg ${getGlow()}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
        </div>
    );
};

export default ProgressBar;
