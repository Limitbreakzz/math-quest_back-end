const ProfileModel = require('../models/profile.model');
const ERROR_CODES = require('../constants/errorCodes');
const { AppError } = require('../middlewares/error.middleware');

exports.getById = async (userId) => {
  const profile = await ProfileModel.findById(userId);
  if (!profile) {
    throw new AppError(ERROR_CODES.PROFILE_NOT_FOUND);
  }
  return profile;
};

exports.updateProfile = async (userId, payload) => {
  if (payload.username) {
    const existing = await ProfileModel.findByUsername(payload.username);
    if (existing && existing.id !== userId) {
      throw new AppError(ERROR_CODES.USERNAME_ALREADY_TAKEN);
    }
  }
  return ProfileModel.updateById(userId, payload);
};
