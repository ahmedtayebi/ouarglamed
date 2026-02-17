// PATH: src/components/Cards/ModuleCard.jsx

import { motion } from 'framer-motion';
import { BookOpen, FileText, Lock } from 'lucide-react';
import useAppStore from '@store/useAppStore';

/**
 * Clickable module card. Shows title, lesson/exam counts, and badges.
 * @param {{ module: Object, badges?: Array<{label:string, color:string}> }} props
 */
const ModuleCard = ({ module, badges = [] }) => {
    const setSelectedModule = useAppStore((s) => s.setSelectedModule);
    const isFilled = module.title !== 'TO_BE_FILLED';
    const lessonCount = module.lessons?.length || 0;
    const examCount = module.exams?.length || 0;

    const displayTitle = isFilled ? module.title : '[ سيُضاف قريبًا ]';

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedModule(module)}
            className={`w-full text-right p-5 rounded-2xl
        transition-all duration-300 group
        bg-white/5 dark:bg-navy-800/40
        border border-white/10 backdrop-blur-sm
        hover:bg-white/10 dark:hover:bg-navy-700/50
        hover:border-primary-500/20 hover:shadow-xl hover:shadow-primary-500/5
        ${!isFilled ? 'opacity-60' : ''}`}
            aria-label={isFilled ? module.title : 'مقياس سيُضاف قريبًا'}
        >
            {/* Badges row */}
            {badges.length > 0 && (
                <div className="flex gap-1.5 mb-3 flex-wrap">
                    {badges.map((badge) => (
                        <span
                            key={badge.label}
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: badge.color }}
                        >
                            {badge.label}
                        </span>
                    ))}
                </div>
            )}

            {/* Title */}
            <h3
                className={`font-bold text-navy-900 dark:text-white mb-3 leading-snug
          group-hover:text-primary-600 dark:group-hover:text-primary-400
          transition-colors ${!isFilled ? 'italic text-navy-400 dark:text-navy-500' : ''}`}
            >
                {!isFilled && <Lock size={14} className="inline ml-1.5 mb-0.5" aria-hidden="true" />}
                {displayTitle}
            </h3>

            {/* Counts */}
            <div className="flex items-center gap-4 text-xs text-navy-500 dark:text-navy-400">
                <span className="flex items-center gap-1">
                    <BookOpen size={13} aria-hidden="true" />
                    {lessonCount} درس
                </span>
                <span className="flex items-center gap-1">
                    <FileText size={13} aria-hidden="true" />
                    {examCount} امتحان
                </span>
            </div>
        </motion.button>
    );
};

export default ModuleCard;
