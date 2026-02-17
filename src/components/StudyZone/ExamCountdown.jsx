// PATH: src/components/StudyZone/ExamCountdown.jsx

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExamCountdown = () => {
    const [exams, setExams] = useState([]);
    const [newExamTitle, setNewExamTitle] = useState('');
    const [newExamDate, setNewExamDate] = useState('');

    // Load exams
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('medguid-exams') || '[]');
        setExams(saved);
    }, []);

    // Save exams
    useEffect(() => {
        localStorage.setItem('medguid-exams', JSON.stringify(exams));
    }, [exams]);

    const addExam = (e) => {
        e.preventDefault();
        if (!newExamTitle || !newExamDate) return;

        const newExam = {
            id: Date.now(),
            title: newExamTitle,
            date: newExamDate,
        };

        setExams([...exams, newExam]);
        setNewExamTitle('');
        setNewExamDate('');
    };

    const deleteExam = (id) => {
        setExams(exams.filter(e => e.id !== id));
    };

    const getDaysLeft = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today
        const examDate = new Date(dateString);
        examDate.setHours(0, 0, 0, 0); // Normalize exam date

        const diffTime = examDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusColor = (days) => {
        if (days < 0) return 'text-gray-500'; // Passed
        if (days === 0) return 'text-red-600 animate-pulse'; // Today
        if (days <= 7) return 'text-red-500'; // Urgent
        if (days <= 30) return 'text-amber-500'; // Warning
        return 'text-emerald-500'; // Safe
    };

    const getStatusText = (days) => {
        if (days < 0) return 'انتهى';
        if (days === 0) return 'اليوم! 💪';
        if (days <= 7) return 'الامتحان قريب! 🔥';
        if (days <= 30) return 'استعد 📚';
        return 'وقت كافٍ 😊';
    };

    return (
        <div className="bg-white/5 dark:bg-navy-800/40 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-primary-500" />
                الامتحانات القادمة
            </h3>

            {/* Input Form */}
            <form onSubmit={addExam} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="اسم الامتحان..."
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-navy-400 focus:outline-none focus:border-primary-500"
                />
                <input
                    type="date"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-1/3 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                    style={{ colorScheme: 'dark' }}
                />
                <button
                    type="submit"
                    className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                    disabled={!newExamTitle || !newExamDate}
                >
                    <Plus size={18} />
                </button>
            </form>

            {/* List */}
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {exams.length === 0 && (
                        <p className="text-center text-navy-400 text-sm py-4">لم تضف أي امتحانات بعد.</p>
                    )}
                    {exams
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((exam) => {
                            const daysLeft = getDaysLeft(exam.date);
                            return (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between group"
                                >
                                    <div>
                                        <h4 className="font-bold text-navy-900 dark:text-white">{exam.title}</h4>
                                        <p className={`text-xs font-bold mt-1 ${getStatusColor(daysLeft)}`}>
                                            {getStatusText(daysLeft)} • {new Date(exam.date).toLocaleDateString('ar-DZ')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-2xl font-black ${getStatusColor(daysLeft)}`}>
                                            {daysLeft > 0 ? daysLeft : 0}
                                            <span className="text-[10px] block text-center opacity-70">يوم</span>
                                        </div>
                                        <button
                                            onClick={() => deleteExam(exam.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ExamCountdown;
