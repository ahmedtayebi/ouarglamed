// PATH: server/src/routes/semester.routes.js

const express = require('express');
const router = express.Router();
const { addModuleToSemester } = require('../controllers/academic.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/:semesterId/modules', protect, addModuleToSemester);

module.exports = router;
