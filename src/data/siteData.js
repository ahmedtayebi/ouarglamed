// PATH: src/data/siteData.js

/**
 * All site-wide text content migrated from the original HTML.
 * Original English text has been translated to Arabic per project spec.
 * @type {SiteData}
 */
const siteData = {
    brand: {
        name: 'Med Guid DZ',
        nameAr: 'ميد قايد الجزائر',
        logoAlt: 'Med Guid DZ — مرجعك الطبي الشامل',
        university: 'جامعة قاصدي مرباح — ورقلة',
    },

    nav: {
        links: [
            { id: 'home', label: 'الرئيسية', path: '/' },
            { id: 'years', label: 'السنوات', path: '/year' }, // MODIFIED: skip big cards, go directly to sidebar layout
            { id: 'study-zone', label: 'منطقة الدراسة', path: '/study-zone' },
            { id: 'resources', label: 'المصادر', path: '/resources' },
            { id: 'about', label: 'من نحن', path: '/about' },
        ],
    },

    hero: {
        headline: 'مرجعك الطبي الشامل',
        subHeadline: 'جامعة ورقلة',
        description:
            'منصة مصممة لدعم وتمكين طلاب الطب في ورقلة. من الموارد والنصائح إلى التوجيه والتحفيز — نحن هنا لجعل رحلتكم أكثر سلاسة وذكاءً ونجاحًا.',
        cta: 'استكشف السنوات',
    },

    stats: [
        { id: 'stat-years', value: 3, label: 'سنوات', icon: 'BookOpen' },
        { id: 'stat-files', value: 500, label: 'ملف', prefix: '+', icon: 'FileText' },
        { id: 'stat-semesters', value: 2, label: 'فصل', icon: 'Calendar' },
        { id: 'stat-price', value: 100, label: 'مجاني', suffix: '%', icon: 'Heart' },
    ],

    features: [
        {
            id: 'feat-search',
            title: 'بحث سريع',
            description: 'ابحث عن أي مقياس أو ملف بسرعة فائقة عبر محرك البحث الذكي.',
            icon: 'Search',
        },
        {
            id: 'feat-dark',
            title: 'وضع ليلي',
            description: 'حافظ على راحة عينيك أثناء المذاكرة الليلية مع الوضع الداكن.',
            icon: 'Moon',
        },
        {
            id: 'feat-progress',
            title: 'تقدم دراسي',
            description: 'تابع تقدمك في كل سنة دراسية وحدد ما أنجزته وما تبقى.',
            icon: 'TrendingUp',
        },
    ],

    contact: {
        title: 'تواصل معنا',
        description:
            'لديك فكرة أو ملاحظة؟ نحن دائمًا سعداء بسماعكم! سواء كان اقتراحًا أو تعليقًا أو كلمة طيبة — مساهمتكم تساعدنا على النمو وتحسين المنصة للجميع.',
        socials: [
            {
                id: 'telegram',
                label: 'Telegram',
                icon: 'Send',
                url: 'https://t.me/ahmed_tayebi',
                color: '#0088CC',
            },
            {
                id: 'instagram',
                label: 'Instagram',
                icon: 'Instagram',
                url: '',
                color: '#E4405F',
            },
            {
                id: 'facebook',
                label: 'Facebook',
                icon: 'Facebook',
                url: '',
                color: '#1877F2',
            },
            {
                id: 'email',
                label: 'Email',
                icon: 'Mail',
                url: '',
                color: '#EA4335',
            },
        ],
    },

    footer: {
        description:
            'Med Guid DZ — منصة مخصصة لدعم طلاب الطب في ورقلة بالموارد والأدوات والتوجيه الأكاديمي. أنشأها أحمد الطيبي.',
        createdBy: 'أحمد الطيبي',
        copyright: '© 2026 Med Guid DZ — جميع الحقوق محفوظة',
    },

    about: {
        title: 'من نحن',
        mission:
            'Med Guid DZ هي منصة رقمية أنشئت لمساعدة طلاب الطب في جامعة قاصدي مرباح ورقلة. هدفنا توفير جميع الموارد الدراسية في مكان واحد، وتسهيل الوصول إلى المحتوى التعليمي بطريقة منظمة وسلسة.',
        team: [
            {
                id: 'member-1',
                name: 'أحمد الطيبي',
                role: 'المؤسس والمطور',
                initials: 'أط',
            },
        ],
        githubUrl: '',
        emailUrl: '',
    },

    resources: {
        title: 'مصادر مفيدة',
        description: 'مجموعة من المصادر الطبية الموثوقة التي تساعدك في مسيرتك الدراسية.',
        categories: ['الكل', 'كتب', 'مواقع', 'تطبيقات', 'فيديو'],
        items: [
            {
                id: 'res-1',
                title: 'منظمة الصحة العالمية',
                titleEn: 'WHO',
                description: 'أحدث الإرشادات والتقارير الصحية العالمية.',
                url: 'https://www.who.int',
                category: 'مواقع',
                icon: 'Globe',
            },
            {
                id: 'res-2',
                title: 'PubMed',
                titleEn: 'PubMed',
                description: 'قاعدة بيانات الأبحاث الطبية والعلمية.',
                url: 'https://pubmed.ncbi.nlm.nih.gov',
                category: 'مواقع',
                icon: 'BookOpen',
            },
            {
                id: 'res-3',
                title: 'Gray\'s Anatomy',
                titleEn: 'Gray\'s Anatomy',
                description: 'المرجع الأساسي في علم التشريح البشري.',
                url: 'https://www.bartleby.com/107/',
                category: 'كتب',
                icon: 'Book',
            },
            {
                id: 'res-4',
                title: 'Osmosis',
                titleEn: 'Osmosis',
                description: 'فيديوهات تعليمية متحركة لجميع المواد الطبية.',
                url: 'https://www.osmosis.org',
                category: 'فيديو',
                icon: 'Play',
            },
            {
                id: 'res-5',
                title: 'Medscape',
                titleEn: 'Medscape',
                description: 'أخبار طبية ومراجع سريرية للأطباء والطلاب.',
                url: 'https://www.medscape.com',
                category: 'مواقع',
                icon: 'Newspaper',
            },
            {
                id: 'res-6',
                title: 'Complete Anatomy',
                titleEn: 'Complete Anatomy',
                description: 'تطبيق تشريح ثلاثي الأبعاد تفاعلي.',
                url: 'https://3d4medical.com',
                category: 'تطبيقات',
                icon: 'Smartphone',
            },
            {
                id: 'res-7',
                title: 'Lecturio',
                titleEn: 'Lecturio',
                description: 'محاضرات فيديو طبية من أساتذة عالميين.',
                url: 'https://www.lecturio.com',
                category: 'فيديو',
                icon: 'Play',
            },
            {
                id: 'res-8',
                title: 'Netter Atlas',
                titleEn: 'Netter Atlas',
                description: 'أطلس التشريح المصور الأشهر عالميًا.',
                url: 'https://www.netterimages.com',
                category: 'كتب',
                icon: 'Book',
            },
        ],
    },

    notFound: {
        title: '404',
        message: 'الصفحة غير موجودة',
        description: 'عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
        backButton: 'العودة للرئيسية',
    },

    seo: {
        defaultTitle: 'Med Guid DZ — مرجعك الطبي الشامل',
        defaultDescription:
            'منصة Med Guid DZ — مرجعك الطبي الشامل لطلاب كلية الطب في جامعة قاصدي مرباح ورقلة. دروس، ملخصات، وموارد أكاديمية.',
        defaultKeywords:
            'طب ورقلة, Med Guid DZ, كلية الطب ورقلة, دروس طب, تشريح, فيزيولوجيا, جامعة قاصدي مرباح',
    },
};

export default siteData;
