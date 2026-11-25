const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaderboard.controller');

router.get('/', controller.getRankings);
router.get('/search', controller.searchPlayers);

module.exports = router;
