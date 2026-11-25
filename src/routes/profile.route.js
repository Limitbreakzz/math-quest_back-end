const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/me', requireAuth, controller.getMe);
router.patch('/me', requireAuth, controller.updateMe);
router.get('/:id', controller.getPublicProfile);

module.exports = router;
