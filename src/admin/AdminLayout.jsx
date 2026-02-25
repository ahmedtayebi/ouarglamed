// PATH: src/admin/AdminLayout.jsx
// ADDED: Admin shell layout with topbar, sidebar, and content area

import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    FlaskConical,
    GraduationCap,
    ExternalLink,
    LogOut,
    Menu,
    X,
    Cross,
    Save, // ADDED
    Loader2 // ADDED
} from 'lucide-react';
import { AUTH_KEY } from '@admin/adminConfig';
import useAdminStore from '@store/useAdminStore'; // ADDED

// ADDED: sidebar navigation items
const sidebarItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, path: '/admin' },
    { id: 'year-1', label: 'السنة الأولى', icon: BookOpen, path: '/admin/year/year-1', color: '#0D9488' },
    { id: 'year-2', label: 'السنة الثانية', icon: FlaskConical, path: '/admin/year/year-2', color: '#16A34A' },
    { id: 'year-3', label: 'السنة الثالثة', icon: GraduationCap, path: '/admin/year/year-3', color: '#D97706' },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // ADDED: Pull state and save function from store
    const { hasUnsavedChanges, isSaving, saveChanges } = useAdminStore();

    // ADDED: check if a sidebar item is active
    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    // ADDED: logout handler
    const handleLogout = () => {
        sessionStorage.removeItem(AUTH_KEY);
        navigate('/admin/login', { replace: true });
    };

    // ADDED: sidebar content (shared between mobile drawer and desktop sidebar)
    const SidebarContent = () => (
        <nav className="flex flex-col gap-1.5 p-3" aria-label="قائمة الإدارة">
            {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                    <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200
                            ${active
                                ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                                : 'text-navy-400 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                    >
                        <Icon size={18} style={active && item.color ? { color: item.color } : {}} />
                        <span>{item.label}</span>
                    </Link>
                );
            })}

            {/* ADDED: divider */}
            <div className="border-t border-white/5 my-2" />

            {/* ADDED: preview site link */}
            <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-navy-400 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
                <ExternalLink size={18} />
                <span>معاينة الموقع</span>
            </a>
        </nav>
    );

    return (
        <div className="min-h-screen bg-navy-950 text-white font-arabic" dir="rtl">
            {/* ADDED: Top bar */}
            <header className="fixed top-0 right-0 left-0 z-50 h-16 bg-navy-900/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* ADDED: Mobile hamburger */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        aria-label={sidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                    {/* ADDED: Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <Cross size={16} className="text-white" />
                        </div>
                        <span className="text-lg font-black bg-gradient-to-l from-primary-400 to-accent-400 bg-clip-text text-transparent">
                            Med Guid DZ
                        </span>
                        <span className="text-navy-500 text-sm font-medium hidden sm:inline">
                            — لوحة الإدارة
                        </span>
                    </div>
                </div>

                {/* ADDED: Actions block */}
                <div className="flex items-center gap-2">
                    {/* ADDED: Save Button */}
                    <AnimatePresence>
                        <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={async () => {
                                    // MODIFIED: [run page-specific pre-save hook before global save]
                                    if (typeof window.__adminYearHandleSaveChanges === 'function') {
                                        const ok = await window.__adminYearHandleSaveChanges();
                                        if (ok === false) return;
                                    }
                                    await saveChanges();
                                }}
                                disabled={isSaving || !hasUnsavedChanges}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm transition-all duration-200
                                    ${hasUnsavedChanges
                                        ? 'bg-accent-500 hover:bg-accent-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                        : 'bg-accent-500/35 hover:bg-accent-500/35 shadow-none'
                                    } disabled:opacity-50`}
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                <span className="hidden sm:inline">{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                        </motion.button>
                    </AnimatePresence>

                    {/* ADDED: Logout button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-bold text-sm transition-all duration-200"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">خروج</span>
                    </button>
                </div>
            </header>

            {/* ADDED: Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed top-16 right-0 bottom-0 w-64 bg-navy-900 border-l border-white/10 z-40 lg:hidden overflow-y-auto"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ADDED: Desktop sidebar */}
            <aside className="hidden lg:flex flex-col fixed top-16 right-0 bottom-0 w-60 bg-navy-900/50 border-l border-white/10 overflow-y-auto">
                <SidebarContent />
            </aside>

            {/* ADDED: Main content area */}
            <main className="pt-16 lg:mr-60">
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
