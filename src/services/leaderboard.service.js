const ProfileModel = require('../models/profile.model');

exports.getRankings = async (sortBy = 'xp', limit = 50) => {
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const orderBy =
    sortBy === 'score'
      ? { totalScore: 'desc' }
      : sortBy === 'wins'
      ? { multiplayerWins: 'desc' }
      : { totalXp: 'desc' };

  const players = await ProfileModel.findLeaderboard(orderBy, safeLimit);

  return players.map((player, index) => ({
    rank: index + 1,
    ...player,
    accuracy:
      player.totalQuestionsAnswered > 0
        ? Math.round((player.totalCorrectAnswers / player.totalQuestionsAnswered) * 1000) / 10
        : 0,
  }));
};

exports.searchPlayers = (query) => ProfileModel.searchByName(String(query || '').trim());
