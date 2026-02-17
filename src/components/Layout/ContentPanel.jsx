// PATH: src/components/Layout/ContentPanel.jsx

import { useParams } from 'react-router-dom';
import { years } from '@data/academicData';
import SemesterView from '@components/Content/SemesterView';
import UnitView from '@components/Content/UnitView';

/**
 * Content panel — reads active year and dispatches to the correct view.
 */
const ContentPanel = () => {
    const { yearId } = useParams();
    const numId = yearId || '1';
    const year = years.find((y) => y.id === `year-${numId}`);

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
