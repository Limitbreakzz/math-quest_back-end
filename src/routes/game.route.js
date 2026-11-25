const express = require('express');
const router = express.Router();
const controller = require('../controllers/game.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/categories', controller.getCategories);
router.get('/questions/random', controller.getRandomQuestions);
router.get('/adventure/worlds', controller.getAdventureWorlds);
router.post('/sessions', requireAuth, controller.submitSession);
router.get('/sessions/me', requireAuth, controller.getMySessions);

module.exports = router;
