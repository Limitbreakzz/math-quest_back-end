const ProfileModel = require('../models/profile.model');
const QuestionModel = require('../models/question.model');
const GameSessionModel = require('../models/gameSession.model');
const CategoryModel = require('../models/category.model');
const ShopModel = require('../models/shop.model');

exports.getAnalytics = async () => {
  const [users, totalGamesPlayed, totalBankQuestions, modeBreakdown] = await Promise.all([
    ProfileModel.findAll(),
    GameSessionModel.countAll(),
    QuestionModel.count(),
    GameSessionModel.groupByMode(),
  ]);

  const activeUsers = users.filter((u) => u.isActive).length;
  const totalQuestionsAnswered = users.reduce((sum, u) => sum + u.totalQuestionsAnswered, 0);

  return {
    totalUsers: users.length,
    activeUsers,
    totalGamesPlayed,
    totalQuestionsAnswered,
    totalBankQuestions,
    modeBreakdown,
  };
};

exports.listUsers = () => ProfileModel.findAll();

exports.updateUser = (userId, patch) => {
  const data = {};
  if (patch.displayName) data.displayName = patch.displayName;
  if (patch.username) data.username = patch.username;
  if (patch.role) data.role = patch.role;
  if (typeof patch.isActive === 'boolean') data.isActive = patch.isActive;
  if (typeof patch.coins === 'number') data.coins = BigInt(patch.coins);
  return ProfileModel.updateById(userId, data);
};

exports.deleteUser = (userId) => ProfileModel.deleteById(userId);

exports.listQuestions = () => QuestionModel.findAll();

exports.createQuestion = (data) => QuestionModel.create(data);

exports.updateQuestion = (id, data) => QuestionModel.update(id, data);

exports.deleteQuestion = (id) => QuestionModel.delete(id);

exports.upsertCategory = (id, data) => CategoryModel.upsert(id, data);

exports.deleteCategory = (id) => CategoryModel.delete(id);

exports.upsertShopItem = (id, data) => ShopModel.upsertItem(id, data);

exports.deleteShopItem = (id) => ShopModel.deleteItem(id);
