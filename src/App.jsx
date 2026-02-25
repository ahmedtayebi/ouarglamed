// PATH: src/App.jsx

import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast'; // ADDED: for save notifications
import Navbar from '@components/Navbar/Navbar';
import NewsTicker from '@components/Navbar/NewsTicker';
import YearSidebar from '@components/Layout/YearSidebar';
import ContentPanel from '@components/Layout/ContentPanel';
import ModuleDrawer from '@components/Drawer/ModuleDrawer';

const Home = lazy(() => import('@pages/Home'));
// REMOVED: YearsPage import — big cards page eliminated
const StudyZonePage = lazy(() => import('@pages/StudyZonePage'));
const About = lazy(() => import('@pages/About'));
const Resources = lazy(() => import('@pages/Resources'));
const NotFound = lazy(() => import('@pages/NotFound'));

// ADDED: Admin page lazy imports
const AdminLogin = lazy(() => import('@admin/AdminLogin'));
const AdminGuard = lazy(() => import('@admin/AdminGuard'));
const AdminLayout = lazy(() => import('@admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@admin/pages/AdminDashboard'));
const AdminYearPage = lazy(() => import('@admin/pages/AdminYearPage'));

/**
 * Loading fallback.
 */
const LoadingFallback = () => (
    <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Root layout shared by all routes.
 */
const RootLayout = () => (
    <div
        className="min-h-screen bg-navy-50 dark:bg-navy-950 text-navy-900 dark:text-white font-arabic transition-colors duration-300"
        dir="rtl"
    >
        <Navbar />
        <NewsTicker />
        <main className="pt-9">
            <Suspense fallback={<LoadingFallback />}>
                <Outlet />
            </Suspense>
        </main>
        <Footer />
        <ModuleDrawer />
    </div>
);

/**
 * Study Zone layout: year sidebar + content panel (the 3-Layer shell).
 */
const StudyZone = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        {/* Mobile tabs at top */}
        <div className="lg:hidden">
            <YearSidebar />
        </div>
        {/* Desktop: sidebar + content */}
        <div className="flex gap-8 mt-2 lg:mt-0">
            <div className="hidden lg:block">
                <YearSidebar />
            </div>
            <ContentPanel />
        </div>
    </div>
);

/**
 * Footer component.
 */
const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-navy-900 dark:bg-navy-950 border-t border-white/5" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <h3 className="text-xl font-black text-white mb-3 bg-gradient-to-l from-primary-400 to-accent-400 bg-clip-text text-transparent inline-block">
                            Med Guid DZ
                        </h3>
                        <p className="text-navy-400 text-sm leading-relaxed">
                            منصة مخصصة لدعم طلاب الطب في ورقلة بالموارد والأدوات والتوجيه الأكاديمي.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
                        <nav className="flex flex-col gap-2" aria-label="روابط الفوتر">
                            <a href="/" className="text-navy-400 hover:text-primary-400 transition-colors text-sm">الرئيسية</a>
                            <a href="/study" className="text-navy-400 hover:text-primary-400 transition-colors text-sm">منطقة الدراسة</a>
                            <a href="/resources" className="text-navy-400 hover:text-primary-400 transition-colors text-sm">المصادر</a>
                            <a href="/about" className="text-navy-400 hover:text-primary-400 transition-colors text-sm">من نحن</a>
                        </nav>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
                        <a
                            href="https://t.me/ahmed_tayebi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy-400 hover:text-primary-400 transition-colors text-sm"
                        >
                            Telegram: @ahmed_tayebi
                        </a>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <p className="text-navy-500 text-sm">
                        © {year} Med Guid DZ — جميع الحقوق محفوظة
                    </p>
                </div>
            </div>
        </footer>
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'year', element: <StudyZone /> }, // MODIFIED: /year shows sidebar layout directly (no big cards)
            { path: 'study-zone', element: <StudyZonePage /> },
            { path: 'year/:yearId', element: <StudyZone /> },
            { path: 'about', element: <About /> },
            { path: 'resources', element: <Resources /> },
            { path: '*', element: <NotFound /> },
        ],
    },
    // ADDED: Admin routes — completely separate from main site
    {
        path: '/admin/login',
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <AdminLogin />
            </Suspense>
        ),
    },
    {
        path: '/admin',
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <AdminGuard />
            </Suspense>
        ),
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: 'year/:yearId', element: <AdminYearPage /> },
                ],
            },
        ],
    },
]);

const App = () => (
    <HelmetProvider>
        <Toaster position="top-center" /> {/* ADDED: global toast notifications */}
        <RouterProvider router={router} />
    </HelmetProvider>
);

export default App;
