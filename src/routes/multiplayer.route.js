const express = require('express');
const router = express.Router();
const controller = require('../controllers/multiplayer.controller');

router.post('/rooms', controller.createRoom);
router.post('/rooms/:roomCode/join', controller.joinRoom);
router.get('/rooms/:roomCode', controller.getRoom);

module.exports = router;
