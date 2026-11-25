const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

router.use(requireAuth, requireAdmin);

router.get('/analytics', controller.getAnalytics);
router.get('/users', controller.listUsers);
router.patch('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);
router.get('/questions', controller.listQuestions);
router.post('/questions', controller.createQuestion);
router.put('/questions/:id', controller.updateQuestion);
router.delete('/questions/:id', controller.deleteQuestion);
router.post('/categories', controller.upsertCategory);
router.delete('/categories/:id', controller.deleteCategory);
router.post('/shop-items', controller.upsertShopItem);
router.delete('/shop-items/:id', controller.deleteShopItem);

module.exports = router;
