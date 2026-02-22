// PATH: src/admin/pages/AdminDashboard.jsx
// ADDED: Admin dashboard with stats overview, completion table, and quick actions

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Layers, Library, FileText, Download, Upload, RotateCcw, Plus, AlertTriangle } from 'lucide-react';
import useAdminStore from '@store/useAdminStore';

/**
 * Compute stats from data for dashboard cards and table.
 */
const computeStats = (data) => {
    let totalUnits = 0;
    let totalModules = 0;
    let totalLessons = 0;
    let totalExams = 0;
    let filledLessons = 0;
    let filledExams = 0;
    let filledModules = 0;

    const yearStats = data.map((year) => {
        let yUnits = 0;
        let yModules = 0;
        let yLessons = 0;
        let yExams = 0;
        let yFilledLessons = 0;
        let yFilledExams = 0;
        let yFilledModules = 0;
        let structureLabel = '';

        const countModule = (mod) => {
            yModules++;
            const filled = mod.title && mod.title !== 'TO_BE_FILLED';
            if (filled) yFilledModules++;
            (mod.lessons || []).forEach((l) => {
                yLessons++;
                if (l.title && l.title !== 'TO_BE_FILLED' && l.driveUrl && l.driveUrl !== 'TO_BE_FILLED') yFilledLessons++;
            });
            (mod.exams || []).forEach((e) => {
                yExams++;
                if (e.title && e.title !== 'TO_BE_FILLED' && e.driveUrl && e.driveUrl !== 'TO_BE_FILLED') yFilledExams++;
            });
        };

        if (year.structure === 'semesters') {
            yUnits = year.semesters.length;
            structureLabel = `${yUnits} فصل`;
            // ADDED: count unique modules only (shared appear in both semesters)
            const seen = new Set();
            year.semesters.forEach((sem) => {
                sem.modules.forEach((m) => {
                    if (!seen.has(m.id)) {
                        seen.add(m.id);
                        countModule(m);
                    }
                });
            });
        } else {
            yUnits = (year.units || []).length;
            structureLabel = `${yUnits} وحدة`;
            (year.standaloneModules || []).forEach(countModule);
            (year.units || []).forEach((u) => u.modules.forEach(countModule));
        }

        totalUnits += yUnits;
        totalModules += yModules;
        totalLessons += yLessons;
        totalExams += yExams;
        filledLessons += yFilledLessons;
        filledExams += yFilledExams;
        filledModules += yFilledModules;

        const total = yModules + yLessons + yExams;
        const filled = yFilledModules + yFilledLessons + yFilledExams;
        const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

        return {
            id: year.id,
            label: year.label,
            color: year.color,
            structureLabel,
            modules: `${yFilledModules}/${yModules}`,
            lessons: `${yFilledLessons}/${yLessons}`,
            exams: `${yFilledExams}/${yExams}`,
            pct,
        };
    });

    return {
        years: data.length,
        totalUnits,
        totalModules,
        totalLessons,
        filledLessons,
        filledExams,
        filledModules,
        yearStats,
    };
};

const AdminDashboard = () => {
    const { data, exportJSON, importJSON, resetToDefault } = useAdminStore();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [importMsg, setImportMsg] = useState(null);
    const fileRef = useRef(null);

    const stats = computeStats(data);

    // ADDED: stat cards config
    const cards = [
        { label: 'سنوات', value: stats.years, icon: BookOpen, color: '#0D9488' },
        { label: 'وحدة', value: stats.totalUnits, icon: Layers, color: '#16A34A' },
        { label: 'موديل', value: stats.totalModules, icon: Library, color: '#8B5CF6' },
        { label: 'درس', value: stats.totalLessons, icon: FileText, color: '#D97706' },
    ];

    // ADDED: handle JSON file import
    const handleImport = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = importJSON(ev.target.result);
            if (result.success) {
                setImportMsg({ type: 'success', text: 'تم الاستيراد بنجاح' });
            } else {
                setImportMsg({ type: 'error', text: `خطأ: ${result.error}` });
            }
            setTimeout(() => setImportMsg(null), 3000);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    // ADDED: handle reset with confirmation
    const handleReset = () => {
        resetToDefault();
        setShowResetConfirm(false);
    };

    return (
        <div className="space-y-8">
            {/* ADDED: Page header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">لوحة التحكم</h1>
                <p className="text-navy-400 mt-1">نظرة عامة على المحتوى الأكاديمي</p>
            </div>

            {/* ADDED: Stat cards row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-navy-900/60 border border-white/5 rounded-2xl p-5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: card.color + '20' }}
                                >
                                    <Icon size={20} style={{ color: card.color }} />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-white">{card.value}</p>
                            <p className="text-navy-400 text-sm mt-1">{card.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* ADDED: Completion table */}
            <div className="bg-navy-900/60 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">تقدم المحتوى</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-right px-6 py-3 text-navy-400 font-semibold">السنة</th>
                                <th className="text-right px-4 py-3 text-navy-400 font-semibold">الهيكل</th>
                                <th className="text-right px-4 py-3 text-navy-400 font-semibold">الموديلات</th>
                                <th className="text-right px-4 py-3 text-navy-400 font-semibold">الدروس</th>
                                <th className="text-right px-4 py-3 text-navy-400 font-semibold">الامتحانات</th>
                                <th className="text-right px-4 py-3 text-navy-400 font-semibold min-w-[160px]">الاكتمال</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.yearStats.map((ys) => (
                                <tr key={ys.id} className="border-b border-white/5 last:border-0">
                                    <td className="px-6 py-4 font-bold text-white">{ys.label}</td>
                                    <td className="px-4 py-4 text-navy-300">{ys.structureLabel}</td>
                                    <td className="px-4 py-4 text-navy-300">{ys.modules}</td>
                                    <td className="px-4 py-4 text-navy-300">{ys.lessons}</td>
                                    <td className="px-4 py-4 text-navy-300">{ys.exams}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${ys.pct}%`,
                                                        backgroundColor: ys.color,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-navy-300 text-xs font-bold w-10 text-left">
                                                {ys.pct}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADDED: Quick actions */}
            <div className="bg-navy-900/60 border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={exportJSON}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20 font-bold text-sm hover:bg-primary-500/20 transition-all"
                    >
                        <Download size={16} />
                        تصدير JSON
                    </button>

                    <button
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20 font-bold text-sm hover:bg-accent-500/20 transition-all"
                    >
                        <Upload size={16} />
                        استيراد JSON
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImport}
                    />

                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-sm hover:bg-red-500/20 transition-all"
                    >
                        <RotateCcw size={16} />
                        إعادة تعيين
                    </button>
                </div>

                {/* ADDED: Import result message */}
                {importMsg && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mt-3 text-sm font-semibold ${importMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                    >
                        {importMsg.text}
                    </motion.p>
                )}
            </div>

            {/* ADDED: Reset confirmation dialog */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-navy-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white">تأكيد إعادة التعيين</h3>
                        </div>
                        <p className="text-navy-300 text-sm mb-6">
                            ⚠️ سيتم حذف كل التعديلات والعودة إلى البيانات الافتراضية. هل أنت متأكد؟
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleReset}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
                            >
                                تأكيد
                            </button>
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-2.5 rounded-xl bg-navy-800 text-navy-300 font-bold text-sm hover:bg-navy-700 transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
