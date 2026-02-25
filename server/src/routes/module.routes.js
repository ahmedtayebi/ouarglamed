// PATH: server/src/routes/module.routes.js

const express = require('express');
const router = express.Router();
const { updateModule, createModule } = require('../controllers/academic.controller');
const { protect } = require('../middleware/auth.middleware');

router.put('/:id', protect, updateModule);
router.post('/', protect, createModule);

module.exports = router;
