// PATH: server/src/controllers/academic.controller.js
const asyncHandler = require('express-async-handler');
const supabase = require('../lib/supabase'); // MODIFIED: replaced Prisma with Supabase

// @desc    Get all academic data
// @route   GET /api/years
// @access  Public
const getAcademicData = asyncHandler(async (req, res) => {
    // MODIFIED: replaced nested select with separate queries to fix schema cache relationship issue
    // Step 1: get all years
    const { data: years, error: yearsError } = await supabase
        .from('Year')
        .select('*')
        .order('id', { ascending: true }); // Keep the original ordering

    // ADDED: throw error if Supabase query fails
    if (yearsError) throw yearsError;

    // Step 2: for each year get its semesters
    for (const year of years) {
        const { data: semesters } = await supabase
            .from('Semester')
            .select('*')
            .eq('yearId', year.id)
            .order('id', { ascending: true }); // Keep the original ordering

        // Step 3: for each semester get its modules
        for (const semester of semesters) {
            // Because of our many-to-many relationship, we need to fetch from SemesterModule then Module
            const { data: semesterModules } = await supabase
                .from('SemesterModule')
                .select('moduleId')
                .eq('semesterId', semester.id);

            const moduleIds = semesterModules ? semesterModules.map(sm => sm.moduleId) : [];
            let modules = [];

            if (moduleIds.length > 0) {
                const { data: fetchedModules } = await supabase
                    .from('Module')
                    .select('*')
                    .in('id', moduleIds);
                modules = fetchedModules || [];
            }

            // Step 4: for each module get lessons and exams
            for (const module of modules) {
                const { data: lessons } = await supabase
                    .from('Lesson')
                    .select('*')
                    .eq('moduleId', module.id);

                const { data: exams } = await supabase
                    .from('Exam')
                    .select('*')
                    .eq('moduleId', module.id);

                module.lessons = lessons || [];
                module.exams = exams || [];
            }
            semester.modules = modules || [];
        }
        year.semesters = semesters || [];

        // Also get units for year 2 and 3
        const { data: units } = await supabase
            .from('Unit')
            .select('*')
            .eq('yearId', year.id)
            .order('id', { ascending: true }); // Keep the original ordering

        for (const unit of units) {
            const { data: modules } = await supabase
                .from('Module')
                .select('*')
                .eq('unitId', unit.id);

            for (const module of modules) {
                const { data: lessons } = await supabase
                    .from('Lesson')
                    .select('*')
                    .eq('moduleId', module.id);

                const { data: exams } = await supabase
                    .from('Exam')
                    .select('*')
                    .eq('moduleId', module.id);

                module.lessons = lessons || [];
                module.exams = exams || [];
            }
            unit.modules = modules || [];
        }
        year.units = units || [];

        // Also get standalone modules
        const { data: standaloneModules } = await supabase
            .from('Module')
            .select('*')
            .eq('standaloneYearId', year.id)
            .eq('isStandalone', true);

        for (const module of (standaloneModules || [])) {
            const { data: lessons } = await supabase
                .from('Lesson')
                .select('*')
                .eq('moduleId', module.id);

            const { data: exams } = await supabase
                .from('Exam')
                .select('*')
                .eq('moduleId', module.id);

            module.lessons = lessons || [];
            module.exams = exams || [];
        }
        year.standaloneModules = standaloneModules || [];
    }

    res.json(years);
});

// @desc    Sync (Overwrite) all academic data
// @route   POST /api/years/sync
// @access  Private
const syncAcademicData = asyncHandler(async (req, res) => {
    const years = req.body;

    if (!Array.isArray(years)) {
        res.status(400);
        throw new Error('Invalid data format. Expected an array of years.');
    }

    // 1. Wipe existing data. Thanks to ON DELETE CASCADE on our Supabase schema, deleting Year drops everything.
    // MODIFIED: replaced Prisma with Supabase
    const { error: deleteError } = await supabase
        .from('Year') // MODIFIED: replaced Prisma with Supabase
        .delete() // MODIFIED: replaced Prisma with Supabase
        .neq('id', 'dummy'); // MODIFIED: replaced Prisma with Supabase

    // ADDED: throw error if Supabase query fails
    if (deleteError) throw deleteError;

    // 2. Prepare bulk inserts
    const yearRows = [];
    const semesterRows = [];
    const unitRows = [];
    const moduleRows = [];
    const semesterModuleRows = [];
    const lessonRows = [];
    const examRows = [];

    // Flattening logic
    for (const year of years) {
        yearRows.push({
            id: year.id,
            label: year.label,
            color: year.color,
            icon: year.icon,
            structure: year.structure,
            createdAt: new Date().toISOString(), // MODIFIED: added updatedAt
            updatedAt: new Date().toISOString() // MODIFIED: added updatedAt
        });

        if (year.semesters) {
            for (const sem of year.semesters) {
                semesterRows.push({ id: sem.id, label: sem.label, yearId: year.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt
                for (const mod of sem.modules) {
                    if (!moduleRows.find(m => m.id === mod.id)) {
                        moduleRows.push({ id: mod.id, title: mod.title, isShared: !!mod.isShared, isStandalone: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt
                    }
                    semesterModuleRows.push({ semesterId: sem.id, moduleId: mod.id });

                    for (const l of mod.lessons || []) {
                        if (!lessonRows.find(x => x.id === l.id && x.moduleId === mod.id)) {
                            lessonRows.push({ id: l.id, title: l.title, driveUrl: l.driveUrl, moduleId: mod.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt
                        }
                    }
                    for (const e of mod.exams || []) {
                        if (!examRows.find(x => x.id === e.id && x.moduleId === mod.id)) {
                            examRows.push({ id: e.id, title: e.title, driveUrl: e.driveUrl, moduleId: mod.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt
                        }
                    }
                }
            }
        }

        if (year.units) {
            for (const unit of year.units) {
                unitRows.push({ id: unit.id, label: unit.label, yearId: year.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt
                for (const mod of unit.modules) {
                    moduleRows.push({ id: mod.id, title: mod.title, isShared: false, isStandalone: false, unitId: unit.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt

                    for (const l of mod.lessons || []) {
                        if (!lessonRows.find(x => x.id === l.id && x.moduleId === mod.id)) {
                            lessonRows.push({ id: l.id, title: l.title, driveUrl: l.driveUrl, moduleId: mod.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt
                        }
                    }
                    for (const e of mod.exams || []) {
                        if (!examRows.find(x => x.id === e.id && x.moduleId === mod.id)) {
                            examRows.push({ id: e.id, title: e.title, driveUrl: e.driveUrl, moduleId: mod.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt
                        }
                    }
                }
            }
        }

        if (year.standaloneModules) {
            for (const mod of year.standaloneModules) {
                moduleRows.push({ id: mod.id, title: mod.title, isShared: false, isStandalone: true, standaloneYearId: year.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added updatedAt

                for (const l of mod.lessons || []) {
                    if (!lessonRows.find(x => x.id === l.id && x.moduleId === mod.id)) {
                        lessonRows.push({ id: l.id, title: l.title, driveUrl: l.driveUrl, moduleId: mod.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added missing timestamps
                    }
                }
                for (const e of mod.exams || []) {
                    if (!examRows.find(x => x.id === e.id && x.moduleId === mod.id)) {
                        examRows.push({ id: e.id, title: e.title, driveUrl: e.driveUrl, moduleId: mod.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); // MODIFIED: added missing timestamps
                    }
                }
            }
        }
    }

    // 3. Batch insert using Supabase
    // MODIFIED: replaced Prisma with Supabase
    if (yearRows.length) {
        const { error } = await supabase.from('Year').upsert(yearRows); // MODIFIED: replaced Prisma with Supabase
        if (error) throw error; // ADDED: handle error
    }
    if (semesterRows.length) {
        const { error } = await supabase.from('Semester').upsert(semesterRows); // MODIFIED: replaced Prisma with Supabase
        if (error) throw error; // ADDED: handle error
    }
    if (unitRows.length) {
        const { error } = await supabase.from('Unit').upsert(unitRows); // MODIFIED: replaced Prisma with Supabase
        if (error) throw error; // ADDED: handle error
    }
    if (moduleRows.length) {
        const { error } = await supabase.from('Module').upsert(moduleRows); // MODIFIED: replaced Prisma with Supabase
        if (error) throw error; // ADDED: handle error
    }
    if (semesterModuleRows.length) {
        const { error } = await supabase.from('SemesterModule').upsert(semesterModuleRows); // MODIFIED: replaced Prisma with Supabase
        if (error) throw error; // ADDED: handle error
    }
    if (lessonRows.length) {
        const { error } = await supabase.from('Lesson').upsert(lessonRows); // MODIFIED: replaced Prisma with Supabase
        if (error) throw error; // ADDED: handle error
    }
    if (examRows.length) {
        const { error } = await supabase.from('Exam').upsert(examRows); // MODIFIED: replaced Prisma with Supabase
        if (error) throw error; // ADDED: handle error
    }

    res.json({ message: "Sync successful" });
});

// @desc    Update single module
// @route   PUT /api/modules/:id
// @access  Private
const updateModule = asyncHandler(async (req, res) => {
    // MODIFIED: added updateModule per explicit instructions to debug direct Supabase writes
    const { data, error } = await supabase
        .from('Module')
        .update({
            title: req.body.title,
            updatedAt: new Date().toISOString() // MODIFIED: added updatedAt
        })
        .eq('id', req.params.id)
        .select();

    if (error) throw error;
    res.json(data[0]);
});

// @desc    Create new module
// @route   POST /api/modules
// @access  Private
const createModule = asyncHandler(async (req, res) => {
    // MODIFIED: added createModule per explicit instructions to support POST new module
    const { data, error } = await supabase
        .from('Module')
        .insert([{
            ...req.body,
            createdAt: new Date().toISOString(), // MODIFIED: added createdAt
            updatedAt: new Date().toISOString()  // MODIFIED: added updatedAt
        }])
        .select();

    if (error) throw error;
    res.status(201).json(data[0]);
});

// @desc    Create new module in a semester
// @route   POST /api/semesters/:semesterId/modules
// @access  Private
const addModuleToSemester = asyncHandler(async (req, res) => {
    const { semesterId } = req.params;
    const { title, isShared } = req.body;

    // 1. Create module
    const { data: module, error } = await supabase
        .from('Module')
        .insert({
            id: `mod-${Date.now()}`,
            title: title || 'موديل جديد',
            isShared: !!isShared,
            isStandalone: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        .select()
        .single();
    if (error) throw error;

    // 2. Link module to semester
    const { error: linkError } = await supabase
        .from('SemesterModule')
        .insert({ moduleId: module.id, semesterId: semesterId });
    if (linkError) throw linkError;

    res.status(201).json(module);
});

// @desc    Delete module and its relations
// @route   DELETE /api/years/modules/:id
// @access  Private
const deleteModule = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // MODIFIED: [remove join rows from legacy Prisma table if present]
    const legacyJoinResult = await supabase.from('_SemesterToModule').delete().eq('A', id);
    if (legacyJoinResult.error && legacyJoinResult.error.code !== 'PGRST205') throw legacyJoinResult.error;

    // MODIFIED: [remove join rows from current SemesterModule table]
    const semesterJoinResult = await supabase.from('SemesterModule').delete().eq('moduleId', id);
    if (semesterJoinResult.error && semesterJoinResult.error.code !== 'PGRST205') throw semesterJoinResult.error;

    // MODIFIED: [delete lessons first]
    const lessonResult = await supabase.from('Lesson').delete().eq('moduleId', id);
    if (lessonResult.error) throw lessonResult.error;

    // MODIFIED: [delete exams]
    const examResult = await supabase.from('Exam').delete().eq('moduleId', id);
    if (examResult.error) throw examResult.error;

    // MODIFIED: [delete module finally]
    const { error } = await supabase.from('Module').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true });
});

// @desc    Add lesson to module
// @route   POST /api/years/modules/:moduleId/lessons
// @access  Private
const addLesson = asyncHandler(async (req, res) => {
    const { moduleId } = req.params; // MODIFIED: [read module id from params]
    const { title, driveUrl } = req.body; // MODIFIED: [read lesson payload]
    const { data, error } = await supabase
        .from('Lesson')
        .insert({
            id: `les-${Date.now()}`, // MODIFIED: [generate lesson id]
            title,
            driveUrl: driveUrl || 'TO_BE_FILLED',
            moduleId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        .select()
        .single();
    if (error) throw error;
    res.json(data);
});

// @desc    Add exam to module
// @route   POST /api/years/modules/:moduleId/exams
// @access  Private
const addExam = asyncHandler(async (req, res) => {
    const { moduleId } = req.params; // MODIFIED: [read module id from params]
    const { title, driveUrl } = req.body; // MODIFIED: [read exam payload]
    const { data, error } = await supabase
        .from('Exam')
        .insert({
            id: `ex-${Date.now()}`, // MODIFIED: [generate exam id]
            title,
            driveUrl: driveUrl || 'TO_BE_FILLED',
            moduleId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        .select()
        .single();
    if (error) throw error;
    res.json(data);
});

// @desc    Delete lesson
// @route   DELETE /api/years/lessons/:id
// @access  Private
const deleteLesson = asyncHandler(async (req, res) => {
    const { error } = await supabase
        .from('Lesson').delete().eq('id', req.params.id); // MODIFIED: [delete lesson by id]
    if (error) throw error;
    res.json({ success: true });
});

// @desc    Delete exam
// @route   DELETE /api/years/exams/:id
// @access  Private
const deleteExam = asyncHandler(async (req, res) => {
    const { error } = await supabase
        .from('Exam').delete().eq('id', req.params.id); // MODIFIED: [delete exam by id]
    if (error) throw error;
    res.json({ success: true });
});

module.exports = {
    getAcademicData,
    syncAcademicData,
    updateModule,
    createModule,
    addModuleToSemester,
    deleteModule,
    addLesson,
    addExam,
    deleteLesson,
    deleteExam
}; // MODIFIED: [export lesson/exam handlers]

// ✅ Done: academic.controller.js
