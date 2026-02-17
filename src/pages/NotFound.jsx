// PATH: src/pages/NotFound.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import PageSEO from '@components/SEO/PageSEO';
import siteData from '@data/siteData';

/**
 * Styled 404 page with navigation back to Home.
 */
const NotFound = () => {
    const { notFound } = siteData;

    return (
        <>
            <PageSEO title="404 — الصفحة غير موجودة" />

            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-[100px]" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center max-w-md"
                >
                    <div className="relative mb-8">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="inline-flex"
                        >
                            <AlertCircle
                                size={80}
                                className="text-primary-500/50"
                                aria-hidden="true"
                            />
                        </motion.div>
                    </div>

                    <h1 className="text-8xl font-black bg-gradient-to-l from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
                        {notFound.title}
                    </h1>

                    <h2 className="text-2xl font-bold text-white mb-4">
                        {notFound.message}
                    </h2>

                    <p className="text-navy-400 mb-10 leading-relaxed">
                        {notFound.description}
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-4
              bg-gradient-to-l from-primary-600 to-accent-500
              hover:from-primary-500 hover:to-accent-400
              text-white font-bold text-lg rounded-xl
              shadow-xl shadow-primary-500/25
              transition-all duration-300
              hover:scale-105 active:scale-95"
                        aria-label={notFound.backButton}
                    >
                        <Home size={20} aria-hidden="true" />
                        {notFound.backButton}
                    </Link>
                </motion.div>
            </div>
        </>
    );
};

export default NotFound;
