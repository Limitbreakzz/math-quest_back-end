const express = require('express');
const router = express.Router();
const controller = require('../controllers/shop.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/items', controller.listItems);
router.get('/inventory', requireAuth, controller.getInventory);
router.get('/purchases', requireAuth, controller.getPurchases);
router.get('/transactions', requireAuth, controller.getTransactions);
router.post('/purchase/:itemId', requireAuth, controller.purchaseItem);
router.post('/equip/:itemId', requireAuth, controller.equipItem);

module.exports = router;
