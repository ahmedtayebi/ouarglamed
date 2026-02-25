// PATH: src/components/Layout/YearSidebar.jsx

import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useEffect } from 'react'; // ADDED: needed for mount fetch
import useAdminStore from '@store/useAdminStore';
import { years } from '@data/academicData'; // ADDED: static year definition

/**
 * Year selector sidebar (desktop) / horizontal tabs (mobile).
 * Always visible. Clicking a year updates URL in place.
 */
const YearSidebar = () => {
    const navigate = useNavigate();
    const { yearId } = useParams();
    // MODIFIED: get static years directly from academicData instead of store

    // Removed isLoading, error, and loadData from useAdminStore
    //    const { data: years, isLoading, error, loadData } = useAdminStore();
    const activeYear = yearId ? `year-${yearId}` : null;

    // ADDED: load API data in background so it's ready for ContentPanel/ModuleDrawer, but don't bock sidebar
    const { loadData, isLoading, error } = useAdminStore();
    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleYearClick = (id) => {
        const numId = id.replace('year-', '');
        navigate(`/year/${numId}`);
    };

    // REMOVED: skeleton for sidebar while loading (now always instant)
    // REMOVED: error state for sidebar (now always instant)

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
                transition-colors duration-300
                ${isActive
                                    ? 'text-white shadow-lg'
                                    : 'bg-white/5 dark:bg-navy-800/40 text-navy-600 dark:text-navy-300 border border-white/10 hover:bg-white/10 dark:hover:bg-navy-700/50'
                                }`}
                            style={isActive ? { backgroundColor: year.color, boxShadow: `0 8px 25px ${year.color}33` } : {}}
                            aria-selected={isActive}
                            role="tab"
                        >
                            {/* MODIFIED: replaced broken left-0 white bar with smooth sliding background indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeYearBg"
                                    className="absolute inset-y-1 right-1 w-1 rounded-full bg-white/60"
                                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                />
                            )}

                            {/* MODIFIED: icon now fades+scales smoothly on year change */}
                            <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                  ${isActive ? 'bg-white/20' : 'bg-white/5'}`}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={year.id + (isActive ? '-active' : '-inactive')}
                                        initial={{ opacity: 0, scale: 0.6 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.6 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                    >
                                        <IconComp size={18} aria-hidden="true" />
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                            <span>{year.label}</span>
                        </motion.button>
                    );
                })}
            </aside>
        </>
    );
};

export default YearSidebar;
