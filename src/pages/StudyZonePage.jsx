// PATH: src/pages/StudyZonePage.jsx

import { useEffect } from 'react';
import PageSEO from '@components/SEO/PageSEO';
import PomodoroTimer from '@components/StudyZone/PomodoroTimer';
import NotesScratchpad from '@components/StudyZone/NotesScratchpad';
import MotivationalQuote from '@components/StudyZone/MotivationalQuote';
import ExamCountdown from '@components/StudyZone/ExamCountdown';
import StudyStats from '@components/StudyZone/StudyStats';

const StudyZonePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <PageSEO
                title="منطقة الدراسة | Med Guid DZ"
                description="لوحة تحكم الطالب - بومودورو، ملاحظات، عداد امتحانات، والمزيد لزيادة إنتاجيتك."
            />

            <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center sm:text-right">
                    <h1 className="text-3xl font-black text-navy-900 dark:text-white mb-2">
                        🧠 منطقة الدراسة <span className="text-primary-500 text-lg font-normal mx-2 hidden sm:inline">|</span> <span className="text-lg text-navy-500 font-normal block sm:inline">أدواتك للتركيز والإنتاجية</span>
                    </h1>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Col 1: Pomodoro (Left on RTL, so actually Right in code if LTR, but we are RTL dir)
             The visual order in RTL: Pomodoro (Right) -> Notes (Center) -> Quote (Left)
             In Grid code:
             [Pomodoro] [Notes] [Quote]
             If dir="rtl", first item is Right.
             Plan Text: Pomodoro | Notes | Quote
             So code order: Pomodoro, Notes, Quote.
          */}

                    <div className="lg:col-span-1">
                        <PomodoroTimer />
                    </div>

                    <div className="lg:col-span-1">
                        <NotesScratchpad />
                    </div>

                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <MotivationalQuote />
                        {/* Small tip or extra space? Quote is small. Let's make quote fill or add something? 
                 Actually Quote component has fixed height approx. 
                 Let's let it auto-height.
             */}
                    </div>
                </div>

                {/* Row 2: Exam Countdown */}
                <div className="mb-6">
                    <ExamCountdown />
                </div>

                {/* Row 3: Stats */}
                <div>
                    <StudyStats />
                </div>
            </div>
        </>
    );
};

export default StudyZonePage;
