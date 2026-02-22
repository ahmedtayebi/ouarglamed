// PATH: src/components/Navbar/Navbar.jsx

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import useTheme from '@hooks/useTheme';
import siteData from '@data/siteData';

/**
 * Sticky glassmorphism navbar with animated active link,
 * dark/light toggle, and mobile hamburger drawer.
 */
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const { nav, brand } = siteData;

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        if (path === '/year') return location.pathname.startsWith('/year'); // MODIFIED: match /year and /year/:id
        if (path === '/study-zone') return location.pathname === '/study-zone';
        return location.pathname.startsWith(path);
    };

    return (
        <header
            className="fixed top-4 left-4 right-4 z-50 
        rounded-2xl px-6 py-3
        bg-white/15 dark:bg-navy-900/70
        backdrop-blur-xl saturate-[1.8]
        border border-white/20 dark:border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
            dir="rtl"
        >
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2.5 group"
                    aria-label="العودة للرئيسية"
                >
                    {/* Inline SVG Caduceus */}
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform group-hover:scale-110"
                        aria-hidden="true"
                    >
                        <circle cx="32" cy="32" r="30" fill="url(#logoGrad)" opacity="0.15" />
                        <path
                            d="M32 8v48M24 16c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z
                M20 28c0-3 3-6 6-6h12c3 0 6 3 6 6s-3 6-6 6H26c-3 0-6-3-6-6z
                M24 40h16M28 48h8"
                            stroke="url(#logoGrad)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <defs>
                            <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64">
                                <stop stopColor="#0D9488" />
                                <stop offset="1" stopColor="#06B6D4" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="text-xl font-black bg-gradient-to-l from-primary-600 to-accent-500 bg-clip-text text-transparent">
                        {brand.name}
                    </span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden md:flex items-center gap-1" aria-label="التنقل الرئيسي">
                    {nav.links.map((link) => (
                        <Link
                            key={link.id}
                            to={link.path}
                            className={`relative px-4 py-2 text-sm font-semibold 
                                transition-colors rounded-lg flex items-center gap-2
                                ${isActive(link.path)
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-navy-700 dark:text-navy-200 hover:text-primary-600 dark:hover:text-primary-400'
                                }`}
                            aria-label={link.label}
                        >
                            {link.label}
                            {link.id === 'study-zone' && (
                                <span className="absolute -top-1 -left-2 px-1.5 py-0.5 rounded-full bg-yellow-400 text-[10px] font-black text-navy-900 shadow-sm animate-pulse">
                                    NEW
                                </span>
                            )}
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute bottom-0 left-2 right-2 h-0.5 
                                        bg-gradient-to-l from-primary-600 to-accent-500 rounded-full"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl 
              bg-white/10 dark:bg-navy-700/50 
              hover:bg-white/20 dark:hover:bg-navy-600/50
              border border-white/10
              transition-all duration-300"
                        aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
                    >
                        <AnimatePresence mode="wait">
                            {theme === 'dark' ? (
                                <motion.div
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Sun size={18} className="text-amber-400" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Moon size={18} className="text-navy-600" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2.5 rounded-xl 
              bg-white/10 dark:bg-navy-700/50 
              hover:bg-white/20 dark:hover:bg-navy-600/50
              border border-white/10 transition-all duration-300"
                        aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X size={18} className="text-navy-700 dark:text-white" />
                        ) : (
                            <Menu size={18} className="text-navy-700 dark:text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden mt-3 pt-3 
              border-t border-white/10"
                        aria-label="قائمة التنقل المحمولة"
                    >
                        <div className="flex flex-col gap-1">
                            {nav.links.map((link) => (
                                <Link
                                    key={link.id}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold
                    transition-colors duration-200
                    ${isActive(link.path)
                                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                            : 'text-navy-700 dark:text-navy-200 hover:bg-white/10'
                                        }`}
                                    aria-label={link.label}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
