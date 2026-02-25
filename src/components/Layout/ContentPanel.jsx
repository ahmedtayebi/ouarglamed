// PATH: src/components/Layout/ContentPanel.jsx

import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // MODIFIED: no longer need Loader2 here
import { useEffect, useMemo } from 'react'; // ADDED: needed for mount fetch & memoization 
import useAdminStore from '@store/useAdminStore';
import { years as staticYears } from '@data/academicData'; // ADDED: the baseline fast data
import SemesterView from '@components/Content/SemesterView';
import UnitView from '@components/Content/UnitView';

// REMOVED: SkeletonCard because this panel now renders instantly using static data



/**
 * Content panel — reads active year and dispatches to the correct view.
 */
const ContentPanel = () => {
    const { yearId } = useParams();
    // MODIFIED: get api data (now renamed to apiData) to intercept and merge
    const { data: apiData, isLoading, loadData } = useAdminStore();

    // ADDED: fetch data on mount unconditionally
    // MODIFIED: fetch fresh data every time page loads
    useEffect(() => {
        loadData(); // always reload — no conditions
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MODIFIED: Move all hooks BEFORE conditional returns to fix hooks bug
    const staticYear = useMemo(() =>
        yearId ? staticYears.find((y) => y.id === `year-${yearId}`) : null
        , [yearId]);
    const apiYear = apiData?.find((y) => y.id === `year-${yearId}`);

    // MODIFIED: Bug 1 - Main site must read directly from API data, not merge.
    // We only use staticYear for the initial loading color/label if API is slow,
    // but the main data structural source of truth is apiYear.
    const year = useMemo(() => {
        if (apiYear) return apiYear;
        if (isLoading) return null;
        return staticYear || null;
    }, [apiYear, isLoading, staticYear]);
    const structureType = String(year?.structure || '').toLowerCase(); // MODIFIED: normalize API/static structure casing

    // REMOVED: isLoading/error boundaries. We ALWAYS render the static structure immediately.

    // ADDED: show placeholder when no year is selected (on /year with no param)
    if (!yearId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
                <ArrowLeft size={40} className="text-navy-400 dark:text-navy-500" />
                <p className="text-lg text-navy-400 dark:text-navy-500 font-semibold">
                    اختر سنة دراسية من القائمة
                </p>
            </div>
        );
    }

    if (isLoading && !apiYear) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <p className="text-navy-400 text-lg">جاري تحميل بيانات السنة...</p>
            </div>
        );
    }

    if (!staticYear) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <p className="text-navy-400 text-lg">السنة غير موجودة</p>
            </div>
        );
    }

    return (
        <div className="flex-1 min-w-0">
            {/* Year header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white">
                    {year.label}
                </h1>
                <div
                    className="w-16 h-1 rounded-full mt-2"
                    style={{ backgroundColor: year.color }}
                />
            </div>

            {/* Dispatch to view based on structure type */}
            {structureType === 'semesters' ? (
                <SemesterView year={year} />
            ) : (
                <UnitView year={year} />
            )}
        </div>
    );
};

export default ContentPanel;

// ✅ Done: ContentPanel.jsx
