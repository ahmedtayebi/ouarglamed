// PATH: server/src/routes/academic.routes.js

const express = require('express');
const router = express.Router();
const {
    getAcademicData,
    syncAcademicData,
    updateModule,
    createModule,
    addModuleToSemester,
    deleteModule,
    addLesson,
    deleteLesson,
    addExam,
    deleteExam
} = require('../controllers/academic.controller'); // MODIFIED: [restore module CRUD handlers]
const { protect } = require('../middleware/auth.middleware');

router.get('/', getAcademicData);
router.post('/sync', protect, syncAcademicData);
router.post('/modules', protect, createModule); // MODIFIED: [add module create route]
router.put('/modules/:id', protect, updateModule); // MODIFIED: [add module update route]
router.delete('/modules/:id', protect, deleteModule); // MODIFIED: [add module delete route]
router.post('/semesters/:semesterId/modules', protect, addModuleToSemester); // MODIFIED: [ensure semester module create route exists]
router.post('/modules/:moduleId/lessons', protect, addLesson); // MODIFIED: [add lesson create route]
router.delete('/lessons/:id', protect, deleteLesson); // MODIFIED: [add lesson delete route]
router.post('/modules/:moduleId/exams', protect, addExam); // MODIFIED: [add exam create route]
router.delete('/exams/:id', protect, deleteExam); // MODIFIED: [add exam delete route]
module.exports = router;

// ✅ Done: academic.routes.js
