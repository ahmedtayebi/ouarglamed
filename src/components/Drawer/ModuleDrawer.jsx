// PATH: src/components/Drawer/ModuleDrawer.jsx

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, ExternalLink, Lock } from 'lucide-react';
import useAppStore from '@store/useAppStore';

/**
 * Full-height slide-in drawer from the right.
 * Shows lesson and exam tabs for the selected module.
 * TO_BE_FILLED items render as disabled "قريبًا".
 */
const ModuleDrawer = () => {
    const selectedModule = useAppStore((s) => s.selectedModule);
    const closeModule = useAppStore((s) => s.closeModule);
    const [activeTab, setActiveTab] = useState('lessons');

    // Close on Esc key
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') closeModule();
        },
        [closeModule],
    );

    useEffect(() => {
        if (selectedModule) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [selectedModule, handleKeyDown]);

    // Reset to lessons tab when module changes
    useEffect(() => {
        if (selectedModule) setActiveTab('lessons');
    }, [selectedModule]);

    const isFilled = selectedModule?.title !== 'TO_BE_FILLED';
    const displayTitle = isFilled
        ? selectedModule?.title
        : '[ سيُضاف قريبًا ]';

    const items =
        activeTab === 'lessons'
            ? selectedModule?.lessons || []
            : selectedModule?.exams || [];

    return (
        <AnimatePresence>
            {selectedModule && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={closeModule}
                        aria-hidden="true"
                    />

                    {/* Drawer panel */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-50
              bg-navy-50 dark:bg-navy-900 border-l border-white/10
              shadow-2xl flex flex-col"
                        dir="rtl"
                        role="dialog"
                        aria-modal="true"
                        aria-label={displayTitle}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                            <h2
                                className={`text-lg font-black text-navy-900 dark:text-white truncate
                  ${!isFilled ? 'italic text-navy-400 dark:text-navy-500' : ''}`}
                            >
                                {displayTitle}
                            </h2>
                            <button
                                onClick={closeModule}
                                className="w-9 h-9 rounded-lg flex items-center justify-center
                  bg-white/5 hover:bg-white/10 transition-colors"
                                aria-label="إغلاق"
                            >
                                <X size={18} className="text-navy-400" />
                            </button>
                        </div>

                        {/* Tab switcher */}
                        <div className="flex gap-1 px-6 pt-4 pb-2">
                            <TabButton
                                label="📚 الدروس"
                                isActive={activeTab === 'lessons'}
                                onClick={() => setActiveTab('lessons')}
                                count={selectedModule?.lessons?.length || 0}
                            />
                            <TabButton
                                label="📝 الامتحانات"
                                isActive={activeTab === 'exams'}
                                onClick={() => setActiveTab('exams')}
                                count={selectedModule?.exams?.length || 0}
                            />
                        </div>

                        {/* Content list */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-2"
                                >
                                    {items.length === 0 ? (
                                        <EmptyState tab={activeTab} />
                                    ) : (
                                        items.map((item, idx) => (
                                            <ItemRow key={item.id || idx} item={item} index={idx} />
                                        ))
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

/**
 * Tab button inside the drawer.
 */
const TabButton = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-center
      transition-all duration-200
      ${isActive
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-white/5 dark:bg-navy-800/40 text-navy-500 dark:text-navy-400 hover:bg-white/10'
            }`}
        role="tab"
        aria-selected={isActive}
    >
        {label}
        <span className={`mr-1.5 text-xs ${isActive ? 'text-white/70' : 'text-navy-500'}`}>
            ({count})
        </span>
    </button>
);

/**
 * Single lesson/exam row.
 */
const ItemRow = ({ item, index }) => {
    const isFilled = item.title !== 'TO_BE_FILLED' && item.driveUrl !== 'TO_BE_FILLED';
    const displayTitle = item.title !== 'TO_BE_FILLED'
        ? item.title
        : `[ عنصر ${index + 1} — قريبًا ]`;

    return (
        <div
            className={`flex items-center gap-3 p-3.5 rounded-xl
        transition-all duration-200
        ${isFilled
                    ? 'bg-white/5 dark:bg-navy-800/30 hover:bg-white/10 dark:hover:bg-navy-700/40'
                    : 'bg-white/[0.02] dark:bg-navy-800/20 opacity-50'
                }`}
        >
            {/* Icon */}
            <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
          ${isFilled ? 'bg-primary-500/10' : 'bg-navy-500/10'}`}
            >
                {isFilled ? (
                    <BookOpen size={16} className="text-primary-500" aria-hidden="true" />
                ) : (
                    <Lock size={16} className="text-navy-500" aria-hidden="true" />
                )}
            </div>

            {/* Title */}
            <span
                className={`flex-1 text-sm font-medium truncate
          ${isFilled
                        ? 'text-navy-800 dark:text-navy-200'
                        : 'text-navy-400 dark:text-navy-500 italic'
                    }`}
            >
                {displayTitle}
            </span>

            {/* Action button */}
            {isFilled ? (
                <a
                    href={item.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2
            rounded-lg bg-primary-600 text-white text-xs font-bold
            hover:bg-primary-500 transition-colors
            shadow-md shadow-primary-500/15"
                    aria-label={`فتح ${displayTitle}`}
                >
                    <ExternalLink size={12} aria-hidden="true" />
                    فتح
                </a>
            ) : (
                <span
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2
            rounded-lg bg-navy-500/10 text-navy-400 text-xs font-medium
            cursor-not-allowed"
                    aria-label="غير متوفر بعد"
                >
                    <Lock size={12} aria-hidden="true" />
                    قريبًا
                </span>
            )}
        </div>
    );
};

/**
 * Empty state when no items exist for a tab.
 */
const EmptyState = ({ tab }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        {tab === 'lessons' ? (
            <BookOpen size={40} className="text-navy-500/30 mb-3" />
        ) : (
            <FileText size={40} className="text-navy-500/30 mb-3" />
        )}
        <p className="text-navy-400 text-sm">
            لا توجد {tab === 'lessons' ? 'دروس' : 'امتحانات'} حاليًا
        </p>
    </div>
);

export default ModuleDrawer;
