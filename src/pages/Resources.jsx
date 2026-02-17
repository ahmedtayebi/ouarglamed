// PATH: src/pages/Resources.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import PageSEO from '@components/SEO/PageSEO';
import siteData from '@data/siteData';

/**
 * Resources page with category filter tabs and external link cards.
 */
const Resources = () => {
    const { resources } = siteData;
    const [activeCategory, setActiveCategory] = useState('الكل');

    const filtered =
        activeCategory === 'الكل'
            ? resources.items
            : resources.items.filter((item) => item.category === activeCategory);

    return (
        <>
            <PageSEO
                title="المصادر"
                description="مجموعة من المصادر الطبية الموثوقة لطلاب الطب"
            />

            <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-black text-navy-900 dark:text-white mb-4">
                        {resources.title}
                    </h1>
                    <p className="text-navy-500 dark:text-navy-400 text-lg max-w-2xl mx-auto">
                        {resources.description}
                    </p>
                </motion.div>

                {/* Category filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {resources.categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-300
                ${activeCategory === cat
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white/5 dark:bg-navy-800/40 text-navy-600 dark:text-navy-300 border border-white/10 hover:bg-white/10 dark:hover:bg-navy-700/50'
                                }`}
                            aria-label={`تصفية حسب: ${cat}`}
                            aria-pressed={activeCategory === cat}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Resource grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item, index) => {
                        const IconComp = Icons[item.icon] || Icons.Link;
                        return (
                            <motion.a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group p-6 rounded-2xl
                  bg-white/5 dark:bg-navy-800/40 
                  border border-white/10 backdrop-blur-sm
                  hover:bg-white/10 dark:hover:bg-navy-700/50
                  hover:border-primary-500/20 hover:shadow-xl hover:shadow-primary-500/5
                  transition-all duration-300"
                                aria-label={`${item.title} — ${item.description}`}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl mb-4 
                    flex items-center justify-center
                    bg-gradient-to-br from-primary-500/20 to-accent-500/20
                    border border-primary-500/10
                    group-hover:scale-110 transition-transform duration-300"
                                >
                                    <IconComp
                                        size={22}
                                        className="text-primary-500"
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1 
                  group-hover:text-primary-600 dark:group-hover:text-primary-400 
                  transition-colors">
                                    {item.title}
                                </h3>
                                {item.titleEn && (
                                    <p className="text-xs text-navy-400 mb-2 font-medium">
                                        {item.titleEn}
                                    </p>
                                )}
                                <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary-500">
                                    <span className="px-2.5 py-0.5 rounded-full bg-primary-500/10">
                                        {item.category}
                                    </span>
                                    <Icons.ExternalLink
                                        size={12}
                                        className="mr-auto"
                                        aria-hidden="true"
                                    />
                                </div>
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Resources;
