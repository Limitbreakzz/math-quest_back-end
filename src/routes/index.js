const express = require('express');
const router = express.Router();

const authRoute = require('./auth.route');
const profileRoute = require('./profile.route');
const gameRoute = require('./game.route');
const shopRoute = require('./shop.route');
const leaderboardRoute = require('./leaderboard.route');
const missionRoute = require('./mission.route');
const multiplayerRoute = require('./multiplayer.route');
const adminRoute = require('./admin.route');

const { sendSuccess } = require('../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(req, res, { service: 'mathquest-backend', uptime: Math.round(process.uptime()) }, 'MathQuest API is running');
});

router.use('/auth', authRoute);
router.use('/profiles', profileRoute);
router.use('/', gameRoute);
router.use('/shop', shopRoute);
router.use('/leaderboard', leaderboardRoute);
router.use('/missions', missionRoute);
router.use('/multiplayer', multiplayerRoute);
router.use('/admin', adminRoute);

module.exports = router;
