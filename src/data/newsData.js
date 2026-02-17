// PATH: src/data/newsData.js

/**
 * News ticker data for the marquee banner.
 * Each item has a unique ID, text, date, category, and urgency flag.
 * @type {Array<NewsItem>}
 */
const newsData = [
    {
        id: 'news-1',
        text: 'مرحبًا بكم في منصة Med Guid DZ — مرجعكم الطبي الشامل لجامعة ورقلة',
        date: '2026-02-17',
        category: 'عام',
        isUrgent: false,
    },
    {
        id: 'news-2',
        text: '📚 تم إضافة ملفات جديدة لمقياس علم التشريح — السنة الأولى',
        date: '2026-02-15',
        category: 'تحديث',
        isUrgent: false,
    },
    {
        id: 'news-3',
        text: '⚠️ تذكير: الامتحانات النهائية تبدأ قريبًا — راجعوا جدول الامتحانات',
        date: '2026-02-10',
        category: 'امتحانات',
        isUrgent: true,
    },
    {
        id: 'news-4',
        text: '🎓 نصيحة: خصصوا وقتًا يوميًا للمراجعة المنتظمة — النجاح يبدأ بالتنظيم',
        date: '2026-02-08',
        category: 'نصائح',
        isUrgent: false,
    },
    {
        id: 'news-5',
        text: '🏥 تم فتح التسجيل للتدريب الصيفي بالمستشفى الجامعي ورقلة',
        date: '2026-02-05',
        category: 'تدريب',
        isUrgent: true,
    },
];

export default newsData;
