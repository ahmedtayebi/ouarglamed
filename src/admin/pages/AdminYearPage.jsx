// PATH: src/admin/pages/AdminYearPage.jsx
// ADDED: 3-column year content editor with inline editing, drag-to-reorder, and Drive URL validation

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    GripVertical,
    Trash2,
    Plus,
    BookOpen,
    FileText,
    ExternalLink,
    AlertCircle,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useAdminStore from '@store/useAdminStore';
import { years as staticYears } from '@data/academicData'; // ADDED: Static academic data for structure lookup
import toast from 'react-hot-toast';
import { api } from '@services/api';

/* ━━━━━━━━━━━━━━━━━ Sortable Row Wrapper ━━━━━━━━━━━━━━━━━ */

const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {children({ listeners })}
        </div>
    );
};

/* ━━━━━━━━━━━━━━━━━ Inline Editable Name ━━━━━━━━━━━━━━━━━ */

const InlineEdit = ({ value, onSave, placeholder = 'أدخل الاسم', autoEdit = false, onAutoEditStart }) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(value || '');

    useEffect(() => { setText(value || ''); }, [value]);
    useEffect(() => {
        if (autoEdit) {
            setEditing(true);
            if (onAutoEditStart) onAutoEditStart();
        }
    }, [autoEdit, onAutoEditStart]);

    const handleBlur = () => {
        setEditing(false);
        if (text.trim()) {
            onSave(text.trim());
        } else {
            setText(value || '');
        }
    };

    if (editing) {
        return (
            <input
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => { if (e.key === 'Enter') handleBlur(); }}
                placeholder={placeholder}
                className={`bg-navy-800 border rounded-lg px-3 py-1.5 text-sm text-white w-full focus:outline-none focus:ring-1 focus:ring-primary-500
                    ${!text.trim() ? 'border-red-500' : 'border-white/10'}`}
            />
        );
    }

    return (
        <span
            onClick={() => setEditing(true)}
            className="cursor-pointer hover:text-primary-400 transition-colors truncate"
            title="اضغط للتعديل"
        >
            {value && value !== 'TO_BE_FILLED' ? value : <span className="text-navy-500 italic">{placeholder}</span>}
        </span>
    );
};

/* ━━━━━━━━━━━━━━━━━ Drive URL Validation ━━━━━━━━━━━━━━━━━ */

const isValidDriveUrl = (url) => !url || url === 'TO_BE_FILLED' || url === '' || url.startsWith('https://drive.google.com');

/* ━━━━━━━━━━━━━━━━━ Lesson / Exam Row ━━━━━━━━━━━━━━━━━━━━ */

const ContentRow = ({ item, onUpdate, onDelete, titlePlaceholder }) => {
    const urlValid = isValidDriveUrl(item.driveUrl);

    return (
        <div className="flex items-start gap-2 bg-navy-800/40 border border-white/5 rounded-xl p-3">
            <div className="flex-1 space-y-2">
                <input
                    value={item.title === 'TO_BE_FILLED' ? '' : item.title}
                    onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
                    placeholder={titlePlaceholder}
                    className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <div className="relative">
                    <input
                        value={item.driveUrl === 'TO_BE_FILLED' ? '' : item.driveUrl}
                        onChange={(e) => onUpdate(item.id, 'driveUrl', e.target.value)}
                        placeholder="رابط Google Drive"
                        className={`w-full bg-navy-900/50 border rounded-lg px-3 py-2 text-sm text-white placeholder-navy-500 focus:outline-none transition-colors
                            ${urlValid ? 'border-white/10 focus:border-primary-500' : 'border-red-500 focus:border-red-500'}`}
                        dir="ltr"
                    />
                    {!urlValid && (
                        <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
                            <AlertCircle size={12} />
                            رابط Drive غير صحيح
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
                {item.driveUrl && item.driveUrl !== 'TO_BE_FILLED' && item.driveUrl !== '' && (
                    <a
                        href={item.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                        title="معاينة الرابط"
                    >
                        <ExternalLink size={14} />
                    </a>
                )}
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="حذف"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

/* ━━━━━━━━━━━━━━━━━ Column Header ━━━━━━━━━━━━━━━━━━━━━━ */

const ColumnHeader = ({ title, count }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-sm">{title}</h3>
            {count !== undefined && (
                <span className="text-xs text-navy-400 bg-navy-800/60 px-2.5 py-1 rounded-full">{count}</span>
            )}
        </div>
    </div>
);

/* ━━━━━━━━━━━━━━━━━ Main Page Component ━━━━━━━━━━━━━━━━━ */

const AdminYearPage = () => {
    const { yearId } = useParams();
    const store = useAdminStore();
    const { data: years, isLoading, error, loadData } = store;

    // MODIFIED: [single loadData call only]
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const year = years.find((y) => y.id === yearId);

    const [selectedContainer, setSelectedContainer] = useState(null); // ADDED: selected unit/semester
    const [selectedModule, setSelectedModule] = useState(null); // ADDED: selected module
    const [autoEditModuleId, setAutoEditModuleId] = useState(null);
    const [showAddModuleForm, setShowAddModuleForm] = useState(false);
    const [pendingNewModule, setPendingNewModule] = useState(null); // MODIFIED: [store pending module locally until main save]
    const [activeTab, setActiveTab] = useState('lessons'); // ADDED: lessons or exams tab

    // ADDED: dnd sensors
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    // ADDED: reset selections when year changes
    useEffect(() => {
        setSelectedContainer(null);
        setSelectedModule(null);
        setShowAddModuleForm(false);
        setPendingNewModule(null);
    }, [yearId]);

    useEffect(() => {
        setShowAddModuleForm(false);
        setPendingNewModule(null);
    }, [selectedContainer]);

    // MODIFIED: Read structure from static data, not API year, to ensure bug-free UI layout
    const staticYearData = staticYears.find(y => y.id === yearId);
    const isSemesters = staticYearData?.structure === 'semesters';

    // ADDED: get containers (semesters or units)
    const containers = isSemesters ? year.semesters : year.units || [];

    // ADDED: get modules for selected container
    const getModules = () => {
        if (!selectedContainer) return [];
        const container = isSemesters
            ? year.semesters.find((s) => s.id === selectedContainer)
            : (year.units || []).find((u) => u.id === selectedContainer);
        return container?.modules || [];
    };
    const selectedModuleId = selectedModule?.id || selectedModule; // MODIFIED: [normalize selected module shape]

    // ADDED: get selected module data
    const getSelectedModule = () => {
        if (!selectedModule || !selectedContainer) return null;

        // Check standalone modules first
        if (selectedContainer === '__standalone__') {
            return (year.standaloneModules || []).find((m) => m.id === selectedModuleId);
        }

        const modules = getModules();
        if (selectedModule && typeof selectedModule === 'object' && selectedModule.id) {
            return modules.find((m) => m.id === selectedModule.id) || selectedModule; // MODIFIED: [resolve clicked object directly]
        }
        return modules.find((m) => m.id === selectedModuleId);
    };

    const currentModule = getSelectedModule();

    // ADDED: handle unit reorder via dnd-kit
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const ids = containers.map((c) => c.id);
        const oldIdx = ids.indexOf(active.id);
        const newIdx = ids.indexOf(over.id);
        const newOrder = arrayMove(ids, oldIdx, newIdx);
        store.reorderUnits(yearId, newOrder);
    };

    const selectedSemesterId = selectedContainer; // MODIFIED: [explicit semester id alias for save debug]

    const handleModuleClick = (module) => {
        // MODIFIED: [debug module selection]
        console.log('=== MODULE CLICKED ===', module);
        setSelectedModule(module);
    };

    const handleDelete = async (moduleId) => {
        // MODIFIED: [debug delete]
        console.log('=== DELETE MODULE ===', moduleId);
        const token = sessionStorage.getItem('medguid-admin-token');
        const result = await api.delete(`/api/years/modules/${moduleId}`, token);
        console.log('=== DELETE RESULT ===', result);
        if (result?.error) {
            toast.error('❌ فشل الحذف: ' + result.error);
            return;
        }
        await loadData();
        toast.success('✅ تم الحذف');
    };

    const handleSaveChanges = async () => {
        // MODIFIED: [debug save]
        console.log('=== SAVE CHANGES CLICKED ===');
        console.log('pendingNewModule:', pendingNewModule);
        console.log('selectedSemesterId:', selectedSemesterId);

        if (!pendingNewModule) return true;
        if (!pendingNewModule?.title?.trim()) {
            toast.error('اكتب اسم الموديل أولاً');
            return false;
        }
        const token = sessionStorage.getItem('medguid-admin-token');
        console.log('token exists:', !!token);
        const result = await api.post(
            `/api/semesters/${selectedSemesterId}/modules`,
            {
                title: pendingNewModule.title,
                isShared: pendingNewModule.type === 'مشترك'
            },
            token
        );
        console.log('=== SAVE RESULT ===', result);
        if (result?.error) {
            toast.error('❌ فشل الحفظ: ' + result.error);
            return false;
        }
        setPendingNewModule(null);
        setShowAddModuleForm(false);
        await loadData();
        toast.success('✅ تم الحفظ');
        return true;
    };

    const handleAddLesson = async () => {
        // MODIFIED: [add lesson row directly in content panel without prompt]
        if (!selectedModuleId) {
            toast.error('اختر موديل أولاً');
            return;
        }
        await store.addLesson(yearId, selectedContainer, selectedModuleId);
    };

    useEffect(() => {
        // MODIFIED: [allow top save button to execute pending module save first]
        window.__adminYearHandleSaveChanges = handleSaveChanges;
        return () => { delete window.__adminYearHandleSaveChanges; };
    }, [handleSaveChanges]);

    // ADDED: load/error states
    if (isLoading && years.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 size={40} className="text-primary-500 animate-spin" />
                <p className="text-lg text-navy-400 font-semibold">جاري تحميل البيانات...</p>
            </div>
        );
    }

    if (error && years.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <p className="text-lg text-red-500 font-semibold">خطأ في تحميل البيانات</p>
            </div>
        );
    }

    if (!year) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-navy-400 text-lg">السنة غير موجودة</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ADDED: Page header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: year.color + '20' }}
                    >
                        <BookOpen size={20} style={{ color: year.color }} />
                    </div>
                    {year.label}
                </h1>
                <p className="text-navy-400 mt-1">
                    {isSemesters ? 'نظام فصلي — فصلان دراسيان' : `نظام وحدات — ${containers.length} وحدة`}
                </p>
            </div>

            {/* ADDED: 3-column editor grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* ━━━━━━━━━━━ COLUMN 1: Units / Semesters ━━━━━━━━━━━ */}
                <div className="bg-navy-900/60 border border-white/5 rounded-2xl overflow-hidden">
                    <ColumnHeader
                        title={isSemesters ? 'الفصول' : 'الوحدات'}
                        count={containers.length}
                    />

                    {/* ADDED: Standalone modules section for unit-based years */}
                    {!isSemesters && (
                        <div className="p-3 border-b border-white/5">
                            <p className="text-xs text-navy-500 font-bold mb-2 px-1">موديلات مستقلة</p>
                            {(year.standaloneModules || []).length === 0 && (
                                <p className="text-xs text-navy-500 px-1 py-1 mb-2">لا توجد موديلات مستقلة بعد</p>
                            )}
                            {(year.standaloneModules || []).map((mod) => (
                                <button
                                    key={mod.id}
                                    onClick={() => {
                                        setSelectedContainer('__standalone__');
                                        setSelectedModule(mod.id);
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1
                                        ${selectedContainer === '__standalone__' && selectedModuleId === mod.id
                                            ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                                            : 'text-navy-300 hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">مستقل</span>
                                    <InlineEdit
                                        value={mod.title}
                                        onSave={(val) => store.renameStandaloneModule(yearId, mod.id, val)}
                                        placeholder="اسم الموديل"
                                        autoEdit={autoEditModuleId === mod.id}
                                        onAutoEditStart={() => setAutoEditModuleId(null)}
                                    />
                                </button>
                            ))}
                            <button
                                onClick={async () => {
                                    const newId = await store.addStandaloneModule(yearId);
                                    setSelectedContainer('__standalone__');
                                    setSelectedModule(newId);
                                    setAutoEditModuleId(newId);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-400 bg-amber-500/5 border border-dashed border-amber-500/30 hover:bg-amber-500/10 transition-all mt-2"
                            >
                                <Plus size={15} />
                                إضافة موديل مستقل
                            </button>
                        </div>
                    )}

                    {/* ADDED: List of units/semesters with drag-to-reorder */}
                    <div className="p-3">
                        {isSemesters ? (
                            // ADDED: Semesters are fixed (no add/delete/reorder)
                            containers.map((sem) => (
                                <button
                                    key={sem.id}
                                    onClick={() => {
                                        setSelectedContainer(sem.id);
                                        setSelectedModule(null);
                                        setShowAddModuleForm(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1
                                        ${selectedContainer === sem.id
                                            ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                                            : 'text-navy-300 hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <ChevronLeft size={16} className={selectedContainer === sem.id ? 'text-primary-400' : 'text-navy-500'} />
                                    {sem.label}
                                </button>
                            ))
                        ) : (
                            // ADDED: Units with drag-to-reorder
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={containers.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                                    {containers.map((unit) => (
                                        <SortableItem key={unit.id} id={unit.id}>
                                            {({ listeners }) => (
                                                <div
                                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1 cursor-pointer
                                                        ${selectedContainer === unit.id
                                                            ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                                                            : 'text-navy-300 hover:bg-white/5 border border-transparent'
                                                        }`}
                                                    onClick={() => {
                                                        setSelectedContainer(unit.id);
                                                        setSelectedModule(null);
                                                        setShowAddModuleForm(false);
                                                    }}
                                                >
                                                    <span {...listeners} className="cursor-grab text-navy-500 hover:text-navy-300 p-1">
                                                        <GripVertical size={14} />
                                                    </span>
                                                    <span className="flex-1 truncate">
                                                        <InlineEdit
                                                            value={unit.label}
                                                            onSave={(val) => store.renameUnit(yearId, unit.id, val)}
                                                            placeholder="اسم الوحدة"
                                                        />
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            store.deleteUnit(yearId, unit.id);
                                                            if (selectedContainer === unit.id) {
                                                                setSelectedContainer(null);
                                                                setSelectedModule(null);
                                                            }
                                                        }}
                                                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
                                                        title="حذف الوحدة"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </SortableItem>
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}

                        {/* ADDED: Add unit button (only for units structure) */}
                        {!isSemesters && (
                            <button
                                onClick={() => store.addUnit(yearId)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-400 bg-primary-500/5 border border-dashed border-primary-500/20 hover:bg-primary-500/10 transition-all mt-2"
                            >
                                <Plus size={16} />
                                إضافة وحدة
                            </button>
                        )}
                    </div>
                </div>

                {/* ━━━━━━━━━━━ COLUMN 2: Modules ━━━━━━━━━━━ */}
                <div className="bg-navy-900/60 border border-white/5 rounded-2xl overflow-hidden">
                    <ColumnHeader
                        title="الموديلات"
                        count={selectedContainer && selectedContainer !== '__standalone__' ? getModules().length : undefined}
                    />

                    <div className="p-3">
                        {!selectedContainer || selectedContainer === '__standalone__' ? (
                            <p className="text-navy-500 text-sm text-center py-8">
                                ← اختر {isSemesters ? 'فصل' : 'وحدة'} أولاً
                            </p>
                        ) : (
                            <>
                                {getModules().map((mod) => (
                                    <div
                                        key={mod.id}
                                        onClick={() => handleModuleClick(mod)}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1 cursor-pointer
                                            ${selectedModuleId === mod.id
                                                ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                                                : 'text-navy-300 hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <span className="flex-1 truncate">
                                            <InlineEdit
                                                value={mod.title}
                                                onSave={(val) => store.renameModule(yearId, selectedContainer, mod.id, val)}
                                                placeholder="اسم الموديل"
                                                autoEdit={autoEditModuleId === mod.id}
                                                onAutoEditStart={() => setAutoEditModuleId(null)}
                                            />
                                        </span>

                                        {/* ADDED: shared toggle (Year 1 only) */}
                                        {isSemesters && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    store.toggleShared(yearId, mod.id);
                                                }}
                                                className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold transition-colors
                                                    ${mod.isShared
                                                        ? 'bg-primary-500/20 text-primary-400'
                                                        : 'bg-navy-700/50 text-navy-500'
                                                    }`}
                                                title={mod.isShared ? 'مشترك بين الفصلين' : 'خاص بهذا الفصل'}
                                            >
                                                {mod.isShared ? 'مشترك' : 'خاص'}
                                            </button>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(mod.id);
                                                if (selectedModuleId === mod.id) setSelectedModule(null);
                                            }}
                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
                                            title="حذف الموديل"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={async () => {
                                        if (isSemesters) {
                                            if (showAddModuleForm) return;
                                            setShowAddModuleForm(true);
                                            setPendingNewModule({ title: '', type: 'خاص' }); // MODIFIED: [create local pending module only]
                                            return;
                                        }
                                        const newId = await store.addModule(yearId, selectedContainer);
                                        setSelectedModule(newId);
                                        setAutoEditModuleId(newId);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-400 bg-primary-500/5 border border-dashed border-primary-500/20 hover:bg-primary-500/10 transition-all mt-2"
                                >
                                    <Plus size={16} />
                                    إضافة موديل
                                </button>

                                {isSemesters && showAddModuleForm && (
                                    <div className="mt-2 p-3 rounded-xl border border-white/10 bg-navy-900/40 space-y-2">
                                        <div className="relative">
                                            <input
                                                value={pendingNewModule?.title || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setPendingNewModule((prev) => ({
                                                        ...(prev || { type: 'خاص' }),
                                                        title: value
                                                    }));
                                                }}
                                                placeholder="اسم الموديل"
                                                className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-primary-500 transition-colors"
                                            />
                                            <button
                                                onClick={() => {
                                                    setShowAddModuleForm(false);
                                                    setPendingNewModule(null);
                                                }}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-md bg-white/5 text-navy-300 hover:bg-white/10 transition-colors"
                                                title="إلغاء"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        {/* MODIFIED: replaced select with toggle buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={async () => {
                                                    const nextShared = false;
                                                    setPendingNewModule((prev) => ({
                                                        ...(prev || { title: '' }),
                                                        type: nextShared ? 'مشترك' : 'خاص'
                                                    }));
                                                }}
                                                className={(pendingNewModule?.type || 'خاص') === 'خاص'
                                                    ? 'flex-1 bg-teal-500 text-white px-4 py-2 rounded-lg font-bold transition-colors'
                                                    : 'flex-1 bg-navy-700 text-navy-300 px-4 py-2 rounded-lg font-bold hover:bg-navy-600 transition-colors'
                                                }
                                            >خاص</button>
                                            <button
                                                onClick={async () => {
                                                    const nextShared = true;
                                                    setPendingNewModule((prev) => ({
                                                        ...(prev || { title: '' }),
                                                        type: nextShared ? 'مشترك' : 'خاص'
                                                    }));
                                                }}
                                                className={(pendingNewModule?.type || 'خاص') === 'مشترك'
                                                    ? 'flex-1 bg-teal-500 text-white px-4 py-2 rounded-lg font-bold transition-colors'
                                                    : 'flex-1 bg-navy-700 text-navy-300 px-4 py-2 rounded-lg font-bold hover:bg-navy-600 transition-colors'
                                                }
                                            >مشترك</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* ━━━━━━━━━━━ COLUMN 3: Lessons & Exams ━━━━━━━━━━━ */}
                <div className="bg-navy-900/60 border border-white/5 rounded-2xl overflow-hidden">
                    <ColumnHeader
                        title="المحتوى"
                    />

                    {!currentModule ? (
                        <p className="text-navy-500 text-sm text-center py-8 px-3">
                            ← اختر موديل لعرض الدروس والامتحانات
                        </p>
                    ) : (
                        <>
                            {/* ADDED: Lessons / Exams tabs */}
                            <div className="flex border-b border-white/5">
                                <button
                                    onClick={() => setActiveTab('lessons')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-colors
                                        ${activeTab === 'lessons'
                                            ? 'text-primary-400 border-b-2 border-primary-400'
                                            : 'text-navy-400 hover:text-white'
                                        }`}
                                >
                                    <BookOpen size={16} />
                                    الدروس ({currentModule.lessons?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('exams')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-colors
                                        ${activeTab === 'exams'
                                            ? 'text-primary-400 border-b-2 border-primary-400'
                                            : 'text-navy-400 hover:text-white'
                                        }`}
                                >
                                    <FileText size={16} />
                                    الامتحانات ({currentModule.exams?.length || 0})
                                </button>
                            </div>

                            <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                                {activeTab === 'lessons' ? (
                                    <>
                                        {(currentModule.lessons || []).map((lesson) => (
                                            <ContentRow
                                                key={lesson.id}
                                                item={lesson}
                                                onUpdate={(id, field, value) =>
                                                    store.updateLesson(yearId, selectedContainer, selectedModuleId, id, field, value)
                                                }
                                                onDelete={(id) =>
                                                    store.deleteLesson(yearId, selectedContainer, selectedModuleId, id)
                                                }
                                                titlePlaceholder="اسم الدرس"
                                            />
                                        ))}
                                        <button
                                            onClick={handleAddLesson}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-400 bg-primary-500/5 border border-dashed border-primary-500/20 hover:bg-primary-500/10 transition-all"
                                        >
                                            <Plus size={16} />
                                            إضافة درس
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {(currentModule.exams || []).map((exam) => (
                                            <ContentRow
                                                key={exam.id}
                                                item={exam}
                                                onUpdate={(id, field, value) =>
                                                    store.updateExam(yearId, selectedContainer, selectedModuleId, id, field, value)
                                                }
                                                onDelete={(id) =>
                                                    store.deleteExam(yearId, selectedContainer, selectedModuleId, id)
                                                }
                                                titlePlaceholder="اسم الامتحان"
                                            />
                                        ))}
                                        <button
                                            onClick={() => store.addExam(yearId, selectedContainer, selectedModuleId)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-400 bg-primary-500/5 border border-dashed border-primary-500/20 hover:bg-primary-500/10 transition-all"
                                        >
                                            <Plus size={16} />
                                            إضافة امتحان
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminYearPage;

// ✅ Done: AdminYearPage.jsx
