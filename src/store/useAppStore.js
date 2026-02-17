// PATH: src/store/useAppStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { years } from '@data/academicData';

/**
 * Main application store with slices:
 * - theme: dark/light toggle (persisted)
 * - year: selected year ID
 * - module: selected module for drawer
 * - search: fuzzy search across all modules
 */

let searchTimeout = null;

/**
 * Collect all modules from a year, regardless of structure.
 * @param {Object} year - Year data object
 * @returns {Array} All modules in the year
 */
const getAllModulesForYear = (year) => {
    const mods = [];
    if (year.structure === 'semesters') {
        const seen = new Set();
        year.semesters.forEach((sem) => {
            sem.modules.forEach((m) => {
                if (!seen.has(m.id)) {
                    seen.add(m.id);
                    mods.push(m);
                }
            });
        });
    } else if (year.structure === 'units') {
        (year.standaloneModules || []).forEach((m) => mods.push(m));
        (year.units || []).forEach((unit) => {
            unit.modules.forEach((m) => mods.push(m));
        });
    }
    return mods;
};

const useAppStore = create(
    persist(
        (set, get) => ({
            /* ── Theme Slice ── */
            theme: 'dark',

            toggleTheme: () => {
                const newTheme = get().theme === 'dark' ? 'light' : 'dark';
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
                set({ theme: newTheme });
            },

            initTheme: () => {
                const { theme } = get();
                document.documentElement.classList.toggle('dark', theme === 'dark');
            },

            /* ── Year Slice ── */
            selectedYear: 'year-1',

            setSelectedYear: (yearId) => set({ selectedYear: yearId }),

            /* ── Module Slice (drawer) ── */
            selectedModule: null,

            setSelectedModule: (module) => set({ selectedModule: module }),

            closeModule: () => set({ selectedModule: null }),

            /* ── Search Slice ── */
            query: '',
            results: [],

            setQuery: (q) => {
                set({ query: q });
                if (searchTimeout) clearTimeout(searchTimeout);

                if (!q.trim()) {
                    set({ results: [] });
                    return;
                }

                searchTimeout = setTimeout(() => {
                    get().runSearch();
                }, 300);
            },

            /**
             * Fuzzy search across all years/modules in the new data shape.
             */
            runSearch: () => {
                const { query } = get();
                if (!query.trim()) {
                    set({ results: [] });
                    return;
                }

                const q = query.toLowerCase().trim();
                const results = [];

                years.forEach((year) => {
                    const allMods = getAllModulesForYear(year);
                    allMods.forEach((mod) => {
                        if (mod.title === 'TO_BE_FILLED') return;
                        const titleMatch = mod.title.toLowerCase().includes(q);
                        if (titleMatch) {
                            results.push({
                                ...mod,
                                yearId: year.id,
                                yearLabel: year.label,
                            });
                        }
                    });
                });

                set({ results });
            },

            clearSearch: () => set({ query: '', results: [] }),
        }),
        {
            name: 'medguid-store',
            partialize: (state) => ({
                theme: state.theme,
            }),
        },
    ),
);

export default useAppStore;
