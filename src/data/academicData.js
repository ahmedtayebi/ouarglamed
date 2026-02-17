// PATH: src/data/academicData.js

/**
 * Academic data for all 3 years.
 * Structure types:
 *   - "semesters" → Year 1 (2 semesters, shared modules)
 *   - "units"     → Year 2 & 3 (units + optional standalone modules)
 *
 * All TO_BE_FILLED fields are placeholders for real content.
 * Modules with isShared: true appear in both semesters but are shown once.
 */

const makeLessons = (count = 3) =>
    Array.from({ length: count }, (_, i) => ({
        id: `les-${String(i + 1).padStart(3, '0')}`,
        title: 'TO_BE_FILLED',
        driveUrl: 'TO_BE_FILLED',
    }));

const makeExams = (count = 2) =>
    Array.from({ length: count }, (_, i) => ({
        id: `ex-${String(i + 1).padStart(3, '0')}`,
        title: 'TO_BE_FILLED',
        driveUrl: 'TO_BE_FILLED',
    }));

export const years = [
    /* ━━━━━━━━━━━━━━━━━ السنة الأولى ━━━━━━━━━━━━━━━━━ */
    {
        id: 'year-1',
        label: 'السنة الأولى',
        color: '#0D9488',
        icon: 'BookOpen',
        structure: 'semesters',
        semesters: [
            {
                id: 's1',
                label: 'الفصل الأول',
                modules: [
                    // ── Shared modules (appear in both semesters) ──
                    {
                        id: 'mod-y1-shared-001',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-002',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-003',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-004',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-005',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-006',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    // ── S1-only modules ──
                    {
                        id: 'mod-y1-s1-001',
                        title: 'TO_BE_FILLED',
                        isShared: false,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-s1-002',
                        title: 'TO_BE_FILLED',
                        isShared: false,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-s1-003',
                        title: 'TO_BE_FILLED',
                        isShared: false,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                ],
            },
            {
                id: 's2',
                label: 'الفصل الثاني',
                modules: [
                    // ── Shared modules (same ids as s1 shared) ──
                    {
                        id: 'mod-y1-shared-001',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-002',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-003',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-004',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-005',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-shared-006',
                        title: 'TO_BE_FILLED',
                        isShared: true,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    // ── S2-only modules ──
                    {
                        id: 'mod-y1-s2-001',
                        title: 'TO_BE_FILLED',
                        isShared: false,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-s2-002',
                        title: 'TO_BE_FILLED',
                        isShared: false,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                    {
                        id: 'mod-y1-s2-003',
                        title: 'TO_BE_FILLED',
                        isShared: false,
                        lessons: makeLessons(3),
                        exams: makeExams(2),
                    },
                ],
            },
        ],
    },

    /* ━━━━━━━━━━━━━━━━━ السنة الثانية ━━━━━━━━━━━━━━━━━ */
    {
        id: 'year-2',
        label: 'السنة الثانية',
        color: '#16A34A',
        icon: 'FlaskConical',
        structure: 'units',
        standaloneModules: [
            {
                id: 'mod-standalone-001',
                title: 'TO_BE_FILLED',
                isStandalone: true,
                lessons: makeLessons(3),
                exams: makeExams(2),
            },
            {
                id: 'mod-standalone-002',
                title: 'TO_BE_FILLED',
                isStandalone: true,
                lessons: makeLessons(3),
                exams: makeExams(2),
            },
        ],
        units: [
            {
                id: 'unit-2-1',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u2-1-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-1-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-1-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-1-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
            {
                id: 'unit-2-2',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u2-2-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-2-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-2-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-2-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
            {
                id: 'unit-2-3',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u2-3-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-3-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-3-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-3-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
            {
                id: 'unit-2-4',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u2-4-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-4-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-4-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-4-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
            {
                id: 'unit-2-5',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u2-5-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-5-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-5-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-5-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
        ],
    },

    /* ━━━━━━━━━━━━━━━━━ السنة الثالثة ━━━━━━━━━━━━━━━━━ */
    {
        id: 'year-3',
        label: 'السنة الثالثة',
        color: '#D97706',
        icon: 'GraduationCap',
        structure: 'units',
        standaloneModules: [],
        units: [
            {
                id: 'unit-3-1',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u3-1-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-1-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-1-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-1-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
            {
                id: 'unit-3-2',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u3-2-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-2-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-2-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-2-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
            {
                id: 'unit-3-3',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u3-3-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-3-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-3-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-3-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
            {
                id: 'unit-3-4',
                label: 'TO_BE_FILLED',
                modules: [
                    { id: 'mod-u3-4-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-4-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-4-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-4-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                ],
            },
        ],
    },
];

export default years;
