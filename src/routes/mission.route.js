const express = require('express');
const router = express.Router();
const controller = require('../controllers/mission.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/', requireAuth, controller.getAll);
router.post('/:missionId/claim', requireAuth, controller.claimMission);

module.exports = router;
