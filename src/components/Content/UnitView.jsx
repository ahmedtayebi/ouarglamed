// PATH: src/components/Content/UnitView.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ModuleCard from '@components/Cards/ModuleCard';

/**
 * Unit-based layout for Year 2 and Year 3.
 * Shows standalone modules at top, then accordion units.
 * @param {{ year: Object }} props
 */
const UnitView = ({ year }) => {
    const standaloneModules = year.standaloneModules || [];
    const units = year.units || [];

    return (
        <div className="space-y-6">
            {/* Standalone modules */}
            {standaloneModules.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-navy-700 dark:text-navy-300 mb-3">
                        مقاييس مستقلة
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {standaloneModules.map((mod) => (
                            <ModuleCard
                                key={mod.id}
                                module={mod}
                                badges={[{ label: 'مستقل', color: '#E11D48' }]}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Unit accordions */}
            <div className="space-y-3">
                {units.map((unit) => (
                    <UnitAccordion key={unit.id} unit={unit} yearColor={year.color} />
                ))}
            </div>
        </div>
    );
};

/**
 * Single accordion item for a unit.
 * @param {{ unit: Object, yearColor: string }} props
 */
const UnitAccordion = ({ unit, yearColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isFilled = unit.label !== 'TO_BE_FILLED';
    const displayLabel = isFilled ? unit.label : '[ وحدة — سيُضاف قريبًا ]';

    return (
        <div
            className={`rounded-2xl border transition-all duration-300 overflow-hidden
        ${isOpen
                    ? 'border-primary-500/20 bg-white/5 dark:bg-navy-800/30'
                    : 'border-white/10 bg-white/[0.02] dark:bg-navy-800/20 hover:bg-white/5 dark:hover:bg-navy-800/30'
                }`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-right"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${yearColor}20` }}
                    >
                        <span className="text-sm font-black" style={{ color: yearColor }}>
                            {unit.modules?.length || 0}
                        </span>
                    </div>
                    <span
                        className={`font-bold text-navy-900 dark:text-white
              ${!isFilled ? 'italic text-navy-400 dark:text-navy-500' : ''}`}
                    >
                        {displayLabel}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <ChevronDown size={20} className="text-navy-400" aria-hidden="true" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(unit.modules || []).map((mod) => (
                                <ModuleCard key={mod.id} module={mod} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UnitView;
