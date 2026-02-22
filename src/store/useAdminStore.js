// PATH: src/store/useAdminStore.js
// ADDED: Admin data management store with localStorage persistence

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { years as defaultData } from '@data/academicData';

// NOTE: Currently data is stored in localStorage (browser only).
// When backend/database is ready:
// - Replace persist middleware with API calls
// - loadData() → GET /api/academic-data
// - Every mutation → POST/PUT/DELETE to API
// - Remove localStorage dependency entirely
// No component changes will be needed — only this store file.

/**
 * Deep-clones the data to avoid mutating the original academicData.
 */
const cloneData = (data) => JSON.parse(JSON.stringify(data));

/**
 * Helper: find a year by ID in data array.
 */
const findYear = (data, yearId) => data.find((y) => y.id === yearId);

/**
 * Helper: find a unit within a year.
 */
const findUnit = (year, unitId) => {
    if (year.structure === 'semesters') {
        return year.semesters.find((s) => s.id === unitId);
    }
    return (year.units || []).find((u) => u.id === unitId);
};

/**
 * Helper: find a module within a unit/semester.
 */
const findModule = (container, moduleId) =>
    (container.modules || []).find((m) => m.id === moduleId);

/**
 * Generate unique ID with prefix.
 */
const genId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const useAdminStore = create(
    persist(
        (set, get) => ({
            data: cloneData(defaultData),

            /* ━━━━━━━━━━━ Unit / Semester Operations ━━━━━━━━━━━ */

            addUnit: (yearId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year || year.structure === 'semesters') return; // ADDED: semesters are fixed
                const newUnit = {
                    id: genId('unit'),
                    label: 'وحدة جديدة',
                    modules: [],
                };
                year.units.push(newUnit);
                set({ data });
            },

            deleteUnit: (yearId, unitId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year || year.structure === 'semesters') return;
                year.units = year.units.filter((u) => u.id !== unitId);
                set({ data });
            },

            renameUnit: (yearId, unitId, newLabel) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                const unit = findUnit(year, unitId);
                if (unit) unit.label = newLabel;
                set({ data });
            },

            reorderUnits: (yearId, newOrder) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year || year.structure === 'semesters') return;
                const unitMap = {};
                year.units.forEach((u) => { unitMap[u.id] = u; });
                year.units = newOrder.map((id) => unitMap[id]).filter(Boolean);
                set({ data });
            },

            /* ━━━━━━━━━━━ Standalone Module Operations ━━━━━━━━━━━ */

            addStandaloneModule: (yearId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year || year.structure === 'semesters') return;
                if (!year.standaloneModules) year.standaloneModules = [];
                year.standaloneModules.push({
                    id: genId('mod-standalone'),
                    title: 'موديل مستقل جديد',
                    isStandalone: true,
                    lessons: [],
                    exams: [],
                });
                set({ data });
            },

            deleteStandaloneModule: (yearId, moduleId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                year.standaloneModules = (year.standaloneModules || []).filter((m) => m.id !== moduleId);
                set({ data });
            },

            renameStandaloneModule: (yearId, moduleId, newTitle) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                const mod = (year.standaloneModules || []).find((m) => m.id === moduleId);
                if (mod) mod.title = newTitle;
                set({ data });
            },

            /* ━━━━━━━━━━━ Module Operations ━━━━━━━━━━━ */

            addModule: (yearId, containerId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                const container = findUnit(year, containerId);
                if (!container) return;
                const newMod = {
                    id: genId('mod'),
                    title: 'موديل جديد',
                    isShared: false,
                    lessons: [],
                    exams: [],
                };
                container.modules.push(newMod);
                set({ data });
            },

            deleteModule: (yearId, containerId, moduleId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                const container = findUnit(year, containerId);
                if (!container) return;
                container.modules = container.modules.filter((m) => m.id !== moduleId);
                set({ data });
            },

            renameModule: (yearId, containerId, moduleId, newTitle) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                const container = findUnit(year, containerId);
                if (!container) return;
                const mod = findModule(container, moduleId);
                if (mod) mod.title = newTitle;
                set({ data });
            },

            toggleShared: (yearId, moduleId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year || year.structure !== 'semesters') return;
                // ADDED: toggle isShared on all instances of this module across semesters
                year.semesters.forEach((sem) => {
                    const mod = sem.modules.find((m) => m.id === moduleId);
                    if (mod) mod.isShared = !mod.isShared;
                });
                set({ data });
            },

            /* ━━━━━━━━━━━ Lesson Operations ━━━━━━━━━━━ */

            addLesson: (yearId, containerId, moduleId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;

                // ADDED: handle standalone modules
                let mod;
                if (containerId === '__standalone__') {
                    mod = (year.standaloneModules || []).find((m) => m.id === moduleId);
                } else {
                    const container = findUnit(year, containerId);
                    if (!container) return;
                    mod = findModule(container, moduleId);
                }
                if (!mod) return;
                mod.lessons.push({
                    id: genId('les'),
                    title: '',
                    driveUrl: '',
                });
                set({ data });
            },

            updateLesson: (yearId, containerId, moduleId, lessonId, field, value) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                let mod;
                if (containerId === '__standalone__') {
                    mod = (year.standaloneModules || []).find((m) => m.id === moduleId);
                } else {
                    const container = findUnit(year, containerId);
                    if (!container) return;
                    mod = findModule(container, moduleId);
                }
                if (!mod) return;
                const lesson = mod.lessons.find((l) => l.id === lessonId);
                if (lesson) lesson[field] = value;
                set({ data });
            },

            deleteLesson: (yearId, containerId, moduleId, lessonId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                let mod;
                if (containerId === '__standalone__') {
                    mod = (year.standaloneModules || []).find((m) => m.id === moduleId);
                } else {
                    const container = findUnit(year, containerId);
                    if (!container) return;
                    mod = findModule(container, moduleId);
                }
                if (!mod) return;
                mod.lessons = mod.lessons.filter((l) => l.id !== lessonId);
                set({ data });
            },

            /* ━━━━━━━━━━━ Exam Operations ━━━━━━━━━━━ */

            addExam: (yearId, containerId, moduleId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                let mod;
                if (containerId === '__standalone__') {
                    mod = (year.standaloneModules || []).find((m) => m.id === moduleId);
                } else {
                    const container = findUnit(year, containerId);
                    if (!container) return;
                    mod = findModule(container, moduleId);
                }
                if (!mod) return;
                mod.exams.push({
                    id: genId('ex'),
                    title: '',
                    driveUrl: '',
                });
                set({ data });
            },

            updateExam: (yearId, containerId, moduleId, examId, field, value) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                let mod;
                if (containerId === '__standalone__') {
                    mod = (year.standaloneModules || []).find((m) => m.id === moduleId);
                } else {
                    const container = findUnit(year, containerId);
                    if (!container) return;
                    mod = findModule(container, moduleId);
                }
                if (!mod) return;
                const exam = mod.exams.find((e) => e.id === examId);
                if (exam) exam[field] = value;
                set({ data });
            },

            deleteExam: (yearId, containerId, moduleId, examId) => {
                const data = cloneData(get().data);
                const year = findYear(data, yearId);
                if (!year) return;
                let mod;
                if (containerId === '__standalone__') {
                    mod = (year.standaloneModules || []).find((m) => m.id === moduleId);
                } else {
                    const container = findUnit(year, containerId);
                    if (!container) return;
                    mod = findModule(container, moduleId);
                }
                if (!mod) return;
                mod.exams = mod.exams.filter((e) => e.id !== examId);
                set({ data });
            },

            /* ━━━━━━━━━━━ Export / Import / Reset ━━━━━━━━━━━ */

            exportJSON: () => {
                const json = JSON.stringify(get().data, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'academicData.json';
                a.click();
                URL.revokeObjectURL(url);
            },

            importJSON: (jsonString) => {
                try {
                    const parsed = JSON.parse(jsonString);
                    if (!Array.isArray(parsed) || parsed.length === 0) {
                        throw new Error('Invalid format');
                    }
                    // ADDED: basic validation — each item must have id and structure
                    parsed.forEach((y) => {
                        if (!y.id || !y.structure) throw new Error('Missing required fields');
                    });
                    set({ data: parsed });
                    return { success: true };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            },

            resetToDefault: () => set({ data: cloneData(defaultData) }),
        }),
        {
            name: 'medguid-academic-data', // ADDED: localStorage key
        },
    ),
);

export default useAdminStore;
