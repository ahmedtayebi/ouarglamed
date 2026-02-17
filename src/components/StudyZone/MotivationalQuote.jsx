// PATH: src/components/StudyZone/MotivationalQuote.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCw } from 'lucide-react';

const QUOTES = [
    { text: "الطب علم وفن، تعلم العلم وأتقن الفن.", author: "حكمة طبية" },
    { text: "إن الله يحب إذا عمل أحدكم عملاً أن يتقنه.", author: "حديث شريف" },
    { text: "كل طبيب عظيم كان يوماً طالباً خائفاً، فلا تستسلم.", author: "غير معروف" },
    { text: "النجاح ليس صدفة، بل هو نتاج العمل الشاق والمثابرة.", author: "بيليه" },
    { text: "دواؤك فيك وما تشعر ... وداؤك منك وما تبصر", author: "علي بن أبي طالب" },
    { text: "لا تدرس لتنجح فقط، ادرس لتنقذ حياة.", author: "نصيحة طبية" },
    { text: "التعب يزول، والإنجاز يبقى.", author: "مقولة تحفيزية" },
    { text: "من جد وجد، ومن زرع حصد.", author: "مثل عربي" },
    { text: "الطريق إلى القمة صعب، لكن المنظر من الأعلى يستحق.", author: "غير معروف" },
    { text: "أنت أقوى مما تعتقد، وأذكى مما تظن.", author: "آلان ميلن" },
    { text: "لا تؤجل عمل اليوم إلى الغد.", author: "مثل عربي" },
    { text: "العلم نور، والجهل ظلام.", author: "مقولة مشهورة" },
    { text: "ثق بنفسك، فأنت قادر على تحقيق المستحيل.", author: "غير معروف" },
    { text: "كل ساعة دراسة تقربك خطوة من حلمك.", author: "تشجيع" },
    { text: "استمر في السعي، فالوصول وشيك.", author: "غير معروف" }
];

const MotivationalQuote = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Randomize on mount
        setIndex(Math.floor(Math.random() * QUOTES.length));
    }, []);

    const nextQuote = () => {
        setIndex((prev) => (prev + 1) % QUOTES.length);
    };

    return (
        <div className="bg-white/5 dark:bg-navy-800/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Quote size={80} className="text-primary-500" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2">
                        <Quote size={20} className="text-primary-500" />
                        جرعة تحفيز
                    </h3>
                    <button
                        onClick={nextQuote}
                        className="p-2 rounded-full hover:bg-white/10 text-navy-500 dark:text-navy-400 hover:text-primary-500 transition-colors"
                        title="اقتباس جديد"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center min-h-[100px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-lg sm:text-xl font-medium text-navy-800 dark:text-navy-100 leading-relaxed mb-3">
                                "{QUOTES[index].text}"
                            </p>
                            <p className="text-sm text-primary-600 dark:text-primary-400 font-bold">
                                — {QUOTES[index].author}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MotivationalQuote;
