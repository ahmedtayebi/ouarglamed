// PATH: src/components/Content/SemesterView.jsx

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModuleCard from '@components/Cards/ModuleCard';

/**
 * Semester-based layout for Year 1.
 * Two tab buttons for semester selection.
 * Shared modules (isShared: true) are deduplicated and shown with a badge.
 * @param {{ year: Object }} props
 */
const SemesterView = ({ year }) => {
    const [activeSemester, setActiveSemester] = useState(0);

    const semesters = year.semesters || [];
    const currentSemester = semesters[activeSemester];

    /**
     * Deduplicate shared modules: show each shared module only once,
     * but still include all non-shared modules.
     */
    const displayModules = useMemo(() => {
        if (!currentSemester) return [];
        const seenShared = new Set();
        return currentSemester.modules.filter((mod) => {
            if (mod.isShared) {
                if (seenShared.has(mod.id)) return false;
                seenShared.add(mod.id);
            }
            return true;
        });
    }, [currentSemester]);

    return (
        <div>
            {/* Semester tabs */}
            <div className="flex gap-2 mb-6">
                {semesters.map((sem, index) => (
                    <button
                        key={sem.id}
                        onClick={() => setActiveSemester(index)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm
              transition-all duration-300
              ${activeSemester === index
                                ? 'text-white shadow-lg shadow-primary-500/25'
                                : 'bg-white/5 dark:bg-navy-800/40 text-navy-600 dark:text-navy-300 border border-white/10 hover:bg-white/10'
                            }`}
                        style={activeSemester === index ? { backgroundColor: year.color } : {}}
                        role="tab"
                        aria-selected={activeSemester === index}
                    >
                        {sem.label}
                    </button>
                ))}
            </div>

            {/* Module cards grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSemester}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                    {displayModules.map((mod) => (
                        <ModuleCard
                            key={mod.id}
                            module={mod}
                            badges={
                                mod.isShared
                                    ? [{ label: 'مشترك بين الفصلين', color: '#7C3AED' }]
                                    : []
                            }
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SemesterView;
