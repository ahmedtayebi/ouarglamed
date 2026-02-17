// PATH: src/pages/About.jsx

import { motion } from 'framer-motion';
import { Github, Mail, Heart } from 'lucide-react';
import PageSEO from '@components/SEO/PageSEO';
import siteData from '@data/siteData';

/**
 * About page with mission statement and team cards.
 */
const About = () => {
    const { about, brand } = siteData;

    return (
        <>
            <PageSEO
                title="من نحن"
                description={`تعرف على فريق ${brand.name} ورؤيتنا`}
            />

            <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl font-black text-navy-900 dark:text-white mb-6">
                        {about.title}
                    </h1>
                    <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-l from-primary-600 to-accent-500 mb-8" />
                </motion.div>

                {/* Mission */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative p-8 sm:p-10 rounded-2xl mb-16
            bg-white/5 dark:bg-navy-800/40 
            border border-white/10 backdrop-blur-sm"
                >
                    <div className="absolute -top-4 right-8">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center
                bg-gradient-to-br from-primary-500 to-accent-500"
                        >
                            <Heart size={20} className="text-white" aria-hidden="true" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4 mt-2">
                        رؤيتنا
                    </h2>
                    <p className="text-navy-600 dark:text-navy-300 leading-relaxed text-lg">
                        {about.mission}
                    </p>
                </motion.div>

                {/* Team */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-8 text-center">
                        فريق العمل
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {about.team.map((member) => (
                            <div
                                key={member.id}
                                className="w-full sm:w-72 p-8 rounded-2xl text-center
                  bg-white/5 dark:bg-navy-800/40 
                  border border-white/10 backdrop-blur-sm
                  hover:bg-white/10 dark:hover:bg-navy-700/50
                  hover:border-primary-500/20
                  transition-all duration-300 group"
                            >
                                {/* Initials avatar */}
                                <div
                                    className="w-20 h-20 rounded-full mx-auto mb-5 
                    flex items-center justify-center
                    bg-gradient-to-br from-primary-500 to-accent-500
                    text-white text-2xl font-black
                    shadow-xl shadow-primary-500/20
                    group-hover:scale-110 transition-transform duration-300"
                                >
                                    {member.initials}
                                </div>
                                <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact links */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center gap-4 mt-16"
                >
                    {about.githubUrl && (
                        <a
                            href={about.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                bg-white/5 dark:bg-navy-800/40 border border-white/10
                text-navy-700 dark:text-navy-200 font-semibold
                hover:bg-white/10 dark:hover:bg-navy-700/50
                transition-all duration-300"
                            aria-label="GitHub"
                        >
                            <Github size={18} aria-hidden="true" />
                            GitHub
                        </a>
                    )}
                    {about.emailUrl && (
                        <a
                            href={`mailto:${about.emailUrl}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                bg-primary-600 text-white font-semibold
                hover:bg-primary-500 transition-colors
                shadow-lg shadow-primary-500/20"
                            aria-label="إرسال بريد إلكتروني"
                        >
                            <Mail size={18} aria-hidden="true" />
                            تواصل معنا
                        </a>
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default About;
