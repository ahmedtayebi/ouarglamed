// PATH: src/admin/AdminLogin.jsx
// ADDED: Admin login page with simple frontend-only authentication

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Cross, AlertCircle } from 'lucide-react';
import { ADMIN, AUTH_KEY } from '@admin/adminConfig';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    // ADDED: auto-redirect if already logged in
    useEffect(() => {
        if (sessionStorage.getItem(AUTH_KEY)) {
            navigate('/admin', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (username === ADMIN.username && password === ADMIN.password) {
            // ADDED: store simple obfuscated token in sessionStorage
            const token = btoa(username + ':' + Date.now());
            sessionStorage.setItem(AUTH_KEY, token);
            navigate('/admin', { replace: true });
        } else {
            // ADDED: shake animation on failed login
            setError('بيانات خاطئة');
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-navy-950 font-arabic p-4"
            dir="rtl"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    x: shake ? [0, -10, 10, -10, 10, 0] : 0, // ADDED: shake on error
                }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="bg-navy-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* ADDED: Medical cross icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Cross size={32} className="text-white" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-white text-center mb-2">
                        لوحة الإدارة
                    </h1>
                    <p className="text-navy-400 text-sm text-center mb-8">
                        Med Guid DZ — تسجيل الدخول
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* ADDED: Username field */}
                        <div className="relative">
                            <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="اسم المستخدم"
                                className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-navy-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                required
                                autoComplete="username"
                            />
                        </div>

                        {/* ADDED: Password field */}
                        <div className="relative">
                            <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="كلمة المرور"
                                className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-navy-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* ADDED: Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                            >
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* ADDED: Submit button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-l from-primary-600 to-accent-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            تسجيل الدخول
                        </button>
                    </form>

                    {/* ADDED: Security notice */}
                    <p className="text-navy-600 text-xs text-center mt-6">
                        ⚠️ هذا نظام مصادقة أمامي فقط — للإنتاج استخدم خادم خلفي مع JWT
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
