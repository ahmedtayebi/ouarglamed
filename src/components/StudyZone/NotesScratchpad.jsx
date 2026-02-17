// PATH: src/components/StudyZone/NotesScratchpad.jsx

import { useState, useEffect } from 'react';
import { Save, Trash2, Copy, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotesScratchpad = () => {
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('saved'); // saved, saving

    useEffect(() => {
        const savedNote = localStorage.getItem('medguid-notes');
        if (savedNote) setNote(savedNote);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (note) {
                localStorage.setItem('medguid-notes', note);
                setStatus('saved');
            }
        }, 2000);

        if (note) setStatus('saving');

        return () => clearTimeout(timer);
    }, [note]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(note);
        // Show toast? relying on button feedback for now
    };

    const clearNotes = () => {
        if (window.confirm('هل أنت متأكد من مسح كل الملاحظات؟')) {
            setNote('');
            localStorage.removeItem('medguid-notes');
        }
    };

    const downloadTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        const date = new Date().toISOString().slice(0, 10);
        element.download = `notes-medguid-${date}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;

    return (
        <div className="bg-white/5 dark:bg-navy-800/40 border border-white/10 rounded-2xl p-1 flex flex-col h-full min-h-[300px]">
            {/* Header / Toolkit */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy-500 dark:text-navy-400">
                        {status === 'saving' ? 'جاري الحفظ...' : '💾 تم الحفظ'}
                    </span>
                </div>
                <div className="flex gap-1">
                    <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg text-navy-500 dark:text-navy-400 hover:text-primary-500 transition-colors" title="نسخ">
                        <Copy size={16} />
                    </button>
                    <button onClick={downloadTxt} className="p-2 hover:bg-white/10 rounded-lg text-navy-500 dark:text-navy-400 hover:text-green-500 transition-colors" title="تحميل">
                        <Download size={16} />
                    </button>
                    <button onClick={clearNotes} className="p-2 hover:bg-white/10 rounded-lg text-navy-500 dark:text-navy-400 hover:text-red-500 transition-colors" title="مسح">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <textarea
                className="flex-1 w-full bg-transparent p-4 text-navy-900 dark:text-navy-100 placeholder-navy-400/50 resize-none focus:outline-none"
                placeholder="اكتب ملاحظاتك العابرة هنا... تُحفظ تلقائياً"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                dir="auto"
            />

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 text-right">
                <span className="text-xs text-navy-500 dark:text-navy-400 font-mono">
                    {wordCount} كلمة
                </span>
            </div>
        </div>
    );
};

export default NotesScratchpad;
