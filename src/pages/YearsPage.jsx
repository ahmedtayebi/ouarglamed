// PATH: src/pages/YearsPage.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import PageSEO from '@components/SEO/PageSEO';
import { years } from '@data/academicData';

const YearsPage = () => {
    return (
        <>
            <PageSEO title="السنوات الدراسية | Med Guid DZ" description="تصفح جميع السنوات الدراسية في كلية الطب جامعة ورقلة" />

            <section className="py-20 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl sm:text-4xl font-black text-navy-900 dark:text-white mb-4">
                            السنوات الدراسية
                        </h1>
                        <p className="text-navy-500 dark:text-navy-400 max-w-2xl mx-auto">
                            اختر السنة الدراسية للوصول إلى جميع الدروس والمحاضرات والامتحانات
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {years.map((year, i) => {
                            const Icon = Icons[year.icon] || Icons.BookOpen;
                            return (
                                <motion.div
                                    key={year.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        to={`/year/${year.id.replace('year-', '')}`}
                                        className="block group relative overflow-hidden rounded-3xl bg-white/5 dark:bg-navy-800/40 
                      border border-white/10 backdrop-blur-sm transition-all duration-300
                      hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2
                      hover:border-primary-500/30"
                                    >
                                        <div className="p-8">
                                            <div
                                                className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg"
                                                style={{ backgroundColor: year.color, boxShadow: `0 8px 30px ${year.color}40` }}
                                            >
                                                <Icon size={32} />
                                            </div>

                                            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                                                {year.label}
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-navy-500 dark:text-navy-400 mt-4">
                                                <span className="flex items-center gap-1.5">
                                                    <Icons.Layers size={16} />
                                                    {year.structure === 'semesters' ? 'نظام فصلي' : 'نظام وحدات'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Decorative gradient blob */}
                                        <div
                                            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                            style={{ backgroundColor: year.color }}
                                        />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
};

export default YearsPage;
