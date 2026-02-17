// PATH: src/components/Layout/YearSidebar.jsx

import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { years } from '@data/academicData';

/**
 * Year selector sidebar (desktop) / horizontal tabs (mobile).
 * Always visible. Clicking a year updates URL in place.
 */
const YearSidebar = () => {
    const navigate = useNavigate();
    const { yearId } = useParams();
    const activeYear = yearId || 'year-1';

    const handleYearClick = (id) => {
        const numId = id.replace('year-', '');
        navigate(`/year/${numId}`);
    };

    return (
        <>
            {/* ── Mobile: horizontal tabs ── */}
            <nav
                className="lg:hidden flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none"
                aria-label="اختيار السنة"
            >
                {years.map((year) => {
                    const isActive = activeYear === year.id;
                    const IconComp = Icons[year.icon] || Icons.BookOpen;
                    return (
                        <button
                            key={year.id}
                            onClick={() => handleYearClick(year.id)}
                            className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm
                transition-all duration-300
                ${isActive
                                    ? 'text-white shadow-lg'
                                    : 'bg-white/5 dark:bg-navy-800/40 text-navy-500 dark:text-navy-400 border border-white/10 hover:bg-white/10'
                                }`}
                            style={isActive ? { backgroundColor: year.color, boxShadow: `0 8px 25px ${year.color}33` } : {}}
                            aria-selected={isActive}
                            role="tab"
                        >
                            <IconComp size={16} aria-hidden="true" />
                            {year.label}
                        </button>
                    );
                })}
            </nav>

            {/* ── Desktop: fixed left sidebar ── */}
            <aside
                className="hidden lg:flex flex-col gap-2 w-56 shrink-0 sticky top-28 self-start p-3"
                aria-label="اختيار السنة"
            >
                {years.map((year) => {
                    const isActive = activeYear === year.id;
                    const IconComp = Icons[year.icon] || Icons.BookOpen;
                    return (
                        <motion.button
                            key={year.id}
                            onClick={() => handleYearClick(year.id)}
                            whileHover={{ x: -4 }}
                            className={`relative flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-bold text-sm text-right
                transition-all duration-300
                ${isActive
                                    ? 'text-white shadow-lg'
                                    : 'bg-white/5 dark:bg-navy-800/40 text-navy-600 dark:text-navy-300 border border-white/10 hover:bg-white/10 dark:hover:bg-navy-700/50'
                                }`}
                            style={isActive ? { backgroundColor: year.color, boxShadow: `0 8px 25px ${year.color}33` } : {}}
                            aria-selected={isActive}
                            role="tab"
                        >
                            <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                  ${isActive ? 'bg-white/20' : 'bg-white/5'}`}
                            >
                                <IconComp size={18} aria-hidden="true" />
                            </div>
                            <span>{year.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="year-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/60"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </aside>
        </>
    );
};

export default YearSidebar;
