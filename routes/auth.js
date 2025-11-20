const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { login, logout, getStatus, createAdmin } = require('../controllers/authController');


router.post('/login', login);
router.post('/logout', logout);

router.get('/status', getStatus);
router.post('/create-admin', createAdmin);

module.exports = router;
