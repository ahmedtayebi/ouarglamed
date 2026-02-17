// PATH: src/pages/Home.jsx

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import PageSEO from '@components/SEO/PageSEO';
import siteData from '@data/siteData';

/**
 * Home page with hero section, stats bar, features, about, and contact.
 */
const Home = () => (
    <>
        <PageSEO title={siteData.seo.defaultTitle} description={siteData.seo.defaultDescription} />
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <ContactSection />
    </>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━ Hero ━━━━━━━━━━━━━━━━━━━━━━━━━ */
const HeroSection = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-16">
            {/* Dynamic Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left: Content */}
                    <div className="text-center lg:text-right order-2 lg:order-1">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            🎓 متاح مجاناً لطلاب الطب
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl/tight font-black text-navy-900 dark:text-white mb-6">
                            {['مرجعك', 'الطبي', 'الشامل', '|', 'جامعة', 'ورقلة'].map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`inline-block ml-3 ${i < 3 ? 'bg-gradient-to-l from-primary-600 to-accent-500 bg-clip-text text-transparent' : ''
                                        }`}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-lg sm:text-xl text-navy-500 dark:text-navy-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            كل دروسك، محاضراتك، وامتحاناتك في مكان واحد.
                            منصة مصممة خصيصاً لتسهيل رحلتك في كلية الطب.
                        </motion.p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Link
                                    to="/years"
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-l from-primary-600 to-accent-600 text-white font-bold text-lg shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Icons.BookOpen size={20} />
                                    استكشف السنوات
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 }}
                            >
                                <Link
                                    to="/study-zone"
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 dark:bg-navy-800/50 text-navy-700 dark:text-white font-bold text-lg border border-navy-200 dark:border-white/10 hover:bg-white/20 hover:border-primary-500/30 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                                >
                                    <Icons.Brain size={20} />
                                    منطقة الدراسة
                                </Link>
                            </motion.div>
                        </div>

                        {/* Stats */}
                        <div className="border-t border-navy-100 dark:border-white/10 pt-8 grid grid-cols-3 gap-8">
                            {[
                                { label: 'سنوات', value: '7' },
                                { label: 'ملف تعليمي', value: '+500' },
                                { label: 'مجاني', value: '100%' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className="text-center lg:text-right"
                                >
                                    <div className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-navy-500 dark:text-navy-400 font-medium">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="relative order-1 lg:order-2 h-[400px] sm:h-[500px] flex items-center justify-center">
                        {/* Main Gradient Circle */}
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-accent-500/20 to-navy-500/20 rounded-full blur-3xl"
                        />

                        <svg viewBox="0 0 400 400" className="w-full h-full max-w-[500px] drop-shadow-2xl">
                            <defs>
                                <linearGradient id="dnaGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#0D9488" />
                                    <stop offset="100%" stopColor="#06B6D4" />
                                </linearGradient>
                            </defs>

                            {/* Orbiting Icons */}
                            {[Icons.Stethoscope, Icons.Brain, Icons.Pill, Icons.FlaskConical].map((Icon, i) => (
                                <motion.g
                                    key={i}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: -i * 7.5 }}
                                    style={{ originX: "200px", originY: "200px" }}
                                >
                                    <circle cx="200" cy="50" r="24" fill="rgba(13, 148, 136, 0.1)" />
                                    <foreignObject x="188" y="38" width="24" height="24">
                                        <Icon size={24} className="text-primary-500" />
                                    </foreignObject>
                                </motion.g>
                            ))}

                            {/* Central DNA Structure */}
                            <motion.g
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                style={{ originX: "200px", originY: "200px" }}
                            >
                                {/* Simplified DNA Double Helix Representation */}
                                <path
                                    d="M160,100 Q240,150 160,200 T160,300"
                                    fill="none"
                                    stroke="url(#dnaGrad)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    className="opacity-80"
                                />
                                <path
                                    d="M240,100 Q160,150 240,200 T240,300"
                                    fill="none"
                                    stroke="url(#dnaGrad)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    className="opacity-80"
                                />
                                {/* Connectivity Lines */}
                                {[120, 160, 200, 240, 280].map(y => (
                                    <line key={y} x1="170" y1={y} x2="230" y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                                ))}
                            </motion.g>

                            {/* Floating Particles */}
                            {Array.from({ length: 8 }).map((_, i) => (
                                <motion.circle
                                    key={i}
                                    r={Math.random() * 4 + 2}
                                    fill="#fff"
                                    initial={{ x: 200, y: 200, opacity: 0 }}
                                    animate={{
                                        x: 200 + (Math.random() - 0.5) * 300,
                                        y: 200 + (Math.random() - 0.5) * 300,
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: Math.random() * 3 + 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                    }}
                                />
                            ))}

                            {/* ECG Line (Heartbeat) */}
                            <motion.path
                                d="M50,350 L100,350 L110,320 L130,380 L140,350 L350,350"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.5 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ━━━━━━━━━━━━━━━━━━━━━━ Features ━━━━━━━━━━━━━━━━━━━━━━━ */
const FeaturesSection = () => (
    <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionHeader title="مميزات المنصة" subtitle="أدوات مصممة لتسهيل رحلتك الدراسية" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                {siteData.features.map((feature, i) => {
                    const Icon = Icons[feature.icon] || Icons.Star;
                    return (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 dark:bg-navy-800/30 border border-white/10
                backdrop-blur-sm hover:border-primary-500/20 hover:shadow-xl hover:shadow-primary-500/5
                transition-all duration-300 group text-center"
                        >
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-500/10
                flex items-center justify-center
                group-hover:bg-primary-500/20 transition-colors">
                                <Icon size={24} className="text-primary-500" aria-hidden="true" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-navy-900 dark:text-white">{feature.title}</h3>
                            <p className="text-navy-500 dark:text-navy-400 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━ About ━━━━━━━━━━━━━━━━━━━━━━━━ */
const AboutSection = () => (
    <section className="py-16 sm:py-20" id="about">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <SectionHeader title={siteData.about.title} subtitle={siteData.brand.university} />
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-navy-600 dark:text-navy-300 text-base sm:text-lg leading-relaxed mt-8 max-w-3xl mx-auto"
            >
                {siteData.about.mission}
            </motion.p>

            {/* Team */}
            <div className="flex justify-center gap-6 mt-10">
                {siteData.about.team.map((member) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-5 rounded-2xl bg-white/5 dark:bg-navy-800/30 border border-white/10 backdrop-blur-sm text-center"
                    >
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
              flex items-center justify-center text-white font-black text-xl">
                            {member.initials}
                        </div>
                        <h4 className="font-bold text-navy-900 dark:text-white">{member.name}</h4>
                        <p className="text-navy-500 dark:text-navy-400 text-sm">{member.role}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ━━━━━━━━━━━━━━━━━━━━━━ Contact ━━━━━━━━━━━━━━━━━━━━━━━ */
const ContactSection = () => (
    <section className="py-16 sm:py-20" id="contact">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <SectionHeader title={siteData.contact.title} subtitle="" />
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-navy-600 dark:text-navy-300 text-base leading-relaxed mt-6 mb-10 max-w-2xl mx-auto"
            >
                {siteData.contact.description}
            </motion.p>

            <div className="flex flex-wrap justify-center gap-4">
                {siteData.contact.socials.map((social) => {
                    const Icon = Icons[social.icon] || Icons.ExternalLink;
                    if (!social.url) return null;
                    return (
                        <motion.a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                bg-white/5 dark:bg-navy-800/40 border border-white/10
                text-navy-700 dark:text-navy-200 font-semibold text-sm
                hover:border-primary-500/20 hover:shadow-lg
                transition-all duration-300"
                            style={{ '--glow': social.color }}
                        >
                            <Icon size={18} style={{ color: social.color }} aria-hidden="true" />
                            {social.label}
                        </motion.a>
                    );
                })}
            </div>
        </div>
    </section>
);

/* ━━━━━━━━━━━━━━━━ Shared ━━━━━━━━━━━━━━━━ */
const SectionHeader = ({ title, subtitle }) => (
    <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-navy-500 dark:text-navy-400 mt-2">{subtitle}</p>}
        <div className="w-16 h-1 mx-auto mt-3 rounded-full bg-gradient-to-l from-primary-500 to-accent-500" />
    </div>
);

export default Home;
