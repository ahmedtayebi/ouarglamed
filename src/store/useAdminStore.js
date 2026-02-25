// PATH: src/store/useAdminStore.js
// MODIFIED: Replaced local persist with real Express API calls

import { create } from 'zustand';
import { api } from '@services/api';

/**
 * Deep-clones the data to avoid mutating references.
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
 * Helper: find a module in all semesters (for shared modules edge cases).
 */
const findModuleAcrossSemesters = (year, moduleId) => {
    if (!year || year.structure !== 'semesters') return null;
    for (const sem of year.semesters || []) {
        const mod = (sem.modules || []).find((m) => m.id === moduleId);
        if (mod) return mod;
    }
    return null;
};

/**
 * Generate unique ID with prefix.
 */
const genId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const useAdminStore = create((set, get) => ({
    // ADDED: loading and error states
    data: [],
    isLoading: false,
    error: null,
    hasUnsavedChanges: false, // ADDED: track uncommitted changes
    isSaving: false, // ADDED: track save progress

    // ADDED: Initial load from API
    // MODIFIED: always fetch fresh data
    loadData: async () => {
        const { isLoading } = get();
        if (isLoading) return; // MODIFIED: [prevent multiple simultaneous loadData calls]
        set({ isLoading: true, error: null });
        try {
            const fresh = await api.get('/api/years');
            set({ data: fresh, isLoading: false, error: null }); // MODIFIED: [avoid resetting unsaved flag during guarded load]
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    // ADDED: sync everything to backend, then reload
    syncData: async (newData) => {
        try {
            // Send the literal array directly, not wrapped in { data: newData }
            await api.post('/api/years/sync', newData);
            await get().loadData();
        } catch (err) {
            set({ error: err.message });
        }
    },

    // MODIFIED: mutations no longer cause navigation
    saveChanges: async () => {
        set({ isSaving: true, error: null });
        try {
            console.log('calling API:', '/api/years/sync', get().data);
            const result = await api.post('/api/years/sync', get().data);
            console.log('API response:', result);
            if (result && result.error) throw new Error(result.error);

            const freshData = await api.get('/api/years');
            if (freshData && freshData.error) throw new Error(freshData.error);

            set({ data: freshData, hasUnsavedChanges: false, isSaving: false });
            return { success: true };
        } catch (err) {
            console.error('API Error:', err);
            set({ error: err.message, isSaving: false });
            return { success: false };
        }
    },


    _runMutation: async (mutationFn) => {
        try {
            const data = cloneData(get().data);
            mutationFn(data);
            console.log('calling API: (local mutation only)', mutationFn.toString().slice(0, 50));
            // MODIFIED: Only update local state, do not call API here (explicit save required)
            set({ data, hasUnsavedChanges: true });
        } catch (err) {
            set({ error: err.message });
        }
    },

    /* ━━━━━━━━━━━ Unit / Semester Operations ━━━━━━━━━━━ */

    // MODIFIED: every mutation refreshes from API after success
    addUnit: async (yearId) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year || year.structure === 'semesters') return;
            const newUnit = {
                id: genId('unit'),
                label: 'وحدة جديدة',
                modules: [],
            };
            year.units.push(newUnit);
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    deleteUnit: async (yearId, unitId) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year || year.structure === 'semesters') return;
            year.units = year.units.filter((u) => u.id !== unitId);
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    renameUnit: async (yearId, unitId, newLabel) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year) return;
            const unit = findUnit(year, unitId);
            if (unit) unit.label = newLabel;
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    reorderUnits: async (yearId, newOrder) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year || year.structure === 'semesters') return;
            const unitMap = {};
            year.units.forEach((u) => { unitMap[u.id] = u; });
            year.units = newOrder.map((id) => unitMap[id]).filter(Boolean);
        });
    },

    /* ━━━━━━━━━━━ Standalone Module Operations ━━━━━━━━━━━ */

    // MODIFIED: every mutation refreshes from API after success
    addStandaloneModule: async (yearId) => {
        const newId = genId('mod-standalone');
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year || year.structure === 'semesters') return;
            if (!year.standaloneModules) year.standaloneModules = [];
            year.standaloneModules.push({
                id: newId,
                title: 'موديل مستقل جديد',
                isStandalone: true,
                lessons: [],
                exams: [],
            });
        });
        return newId;
    },

    // MODIFIED: every mutation refreshes from API after success
    deleteStandaloneModule: async (yearId, moduleId) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year) return;
            year.standaloneModules = (year.standaloneModules || []).filter((m) => m.id !== moduleId);
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    renameStandaloneModule: async (yearId, moduleId, newTitle) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year) return;
            const mod = (year.standaloneModules || []).find((m) => m.id === moduleId);
            if (mod) mod.title = newTitle;
        });
    },

    /* ━━━━━━━━━━━ Module Operations ━━━━━━━━━━━ */

    // MODIFIED: add module as local mutation (saved later via saveChanges)
    addModule: async (yearId, containerId, options = {}) => {
        const newId = containerId === '__standalone__' ? genId('mod-standalone') : genId('mod');
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year) return;
            const title = (options.title || '').trim() || 'موديل جديد';
            const isShared = !!options.isShared;

            if (containerId === '__standalone__') {
                if (!year.standaloneModules) year.standaloneModules = [];
                year.standaloneModules.push({
                    id: newId,
                    title,
                    isStandalone: true,
                    lessons: [],
                    exams: [],
                });
                return;
            }

            if (year.structure === 'semesters') {
                const targetSemester = year.semesters.find((s) => s.id === containerId);
                if (!targetSemester) return;
                const moduleBase = {
                    id: newId,
                    title,
                    isShared,
                    lessons: [],
                    exams: [],
                };
                if (isShared) {
                    year.semesters.forEach((sem) => {
                        if (!sem.modules) sem.modules = [];
                        sem.modules.push({ ...moduleBase });
                    });
                } else {
                    if (!targetSemester.modules) targetSemester.modules = [];
                    targetSemester.modules.push(moduleBase);
                }
                return;
            }

            const container = findUnit(year, containerId);
            if (!container) return;

            if (!container.modules) container.modules = [];
            container.modules.push({
                id: newId,
                title,
                isShared: false,
                lessons: [],
                exams: [],
            });
        });
        return newId;
    },

    // MODIFIED: every mutation refreshes from API after success
    deleteModule: async (yearId, containerId, moduleId) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year) return;
            if (year.structure === 'semesters') {
                year.semesters.forEach((sem) => {
                    sem.modules = (sem.modules || []).filter((m) => m.id !== moduleId);
                });
                return;
            }
            const container = findUnit(year, containerId);
            if (!container) return;
            container.modules = container.modules.filter((m) => m.id !== moduleId);
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    renameModule: async (yearId, containerId, moduleId, newTitle) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year) return;
            if (year.structure === 'semesters') {
                year.semesters.forEach((sem) => {
                    const mod = (sem.modules || []).find((m) => m.id === moduleId);
                    if (mod) mod.title = newTitle;
                });
                return;
            }
            const container = findUnit(year, containerId);
            if (!container) return;
            const mod = findModule(container, moduleId);
            if (mod) mod.title = newTitle;
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    toggleShared: async (yearId, moduleId) => {
        await get()._runMutation((data) => {
            const year = findYear(data, yearId);
            if (!year || year.structure !== 'semesters') return;
            year.semesters.forEach((sem) => {
                const mod = sem.modules.find((m) => m.id === moduleId);
                if (mod) mod.isShared = !mod.isShared;
            });
        });
    },

    /* ━━━━━━━━━━━ Lesson Operations ━━━━━━━━━━━ */

    // MODIFIED: every mutation refreshes from API after success
    addLesson: async (yearId, containerId, moduleId) => {
        await get()._runMutation((data) => {
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
            if (!mod) mod = findModuleAcrossSemesters(year, moduleId); // MODIFIED: [support semester shared-module lookup]
            if (!mod) return;
            if (!mod.lessons) mod.lessons = []; // MODIFIED: [ensure lessons array exists]
            mod.lessons.push({
                id: genId('les'),
                title: '',
                driveUrl: '',
            });
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    updateLesson: async (yearId, containerId, moduleId, lessonId, field, value) => {
        await get()._runMutation((data) => {
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
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    deleteLesson: async (yearId, containerId, moduleId, lessonId) => {
        await get()._runMutation((data) => {
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
        });
    },

    /* ━━━━━━━━━━━ Exam Operations ━━━━━━━━━━━ */

    // MODIFIED: every mutation refreshes from API after success
    addExam: async (yearId, containerId, moduleId) => {
        await get()._runMutation((data) => {
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
            if (!mod) mod = findModuleAcrossSemesters(year, moduleId); // MODIFIED: [support semester shared-module lookup]
            if (!mod) return;
            if (!mod.exams) mod.exams = []; // MODIFIED: [ensure exams array exists]
            mod.exams.push({
                id: genId('ex'),
                title: '',
                driveUrl: '',
            });
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    updateExam: async (yearId, containerId, moduleId, examId, field, value) => {
        await get()._runMutation((data) => {
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
        });
    },

    // MODIFIED: every mutation refreshes from API after success
    deleteExam: async (yearId, containerId, moduleId, examId) => {
        await get()._runMutation((data) => {
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
        });
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

    importJSON: async (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                throw new Error('Invalid format');
            }
            parsed.forEach((y) => {
                if (!y.id || !y.structure) throw new Error('Missing required fields');
            });
            set({ data: parsed, hasUnsavedChanges: true });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    resetToDefault: async () => {
        try {
            const { years: defaultData } = await import('@data/academicData');
            set({ data: cloneData(defaultData), hasUnsavedChanges: true });
        } catch (e) {
            set({ error: e.message });
        }
    },
}));

// MODIFIED: [avoid duplicate initial fetch; each page loads explicitly]

export default useAdminStore;
