// PATH: src/components/Layout/ContentPanel.jsx

import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // ADDED: arrow icon for placeholder
import useAdminStore from '@store/useAdminStore'; // MODIFIED: reads from store — reflects admin changes instantly
import SemesterView from '@components/Content/SemesterView';
import UnitView from '@components/Content/UnitView';

/**
 * Content panel — reads active year and dispatches to the correct view.
 */
const ContentPanel = () => {
    const { yearId } = useParams();
    const { data: years } = useAdminStore(); // MODIFIED: reads from store instead of static file

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

    const year = years.find((y) => y.id === `year-${yearId}`); // MODIFIED: uses store data

    if (!year) {
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
            {year.structure === 'semesters' ? (
                <SemesterView year={year} />
            ) : (
                <UnitView year={year} />
            )}
        </div>
    );
};

export default ContentPanel;
