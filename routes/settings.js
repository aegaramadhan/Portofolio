const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/', getSettings);
router.put('/', requireAdmin, updateSettings);

module.exports = router;
