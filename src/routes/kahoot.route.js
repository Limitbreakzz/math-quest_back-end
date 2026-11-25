const express = require('express');
const router = express.Router();
const controller = require('../controllers/kahoot.controller');

router.post('/rooms', controller.createRoom);
router.post('/rooms/:pin/join', controller.joinRoom);
router.get('/rooms/:pin', controller.getRoom);

module.exports = router;
