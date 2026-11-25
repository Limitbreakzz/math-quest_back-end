const leaderboardService = require('../services/leaderboard.service');

exports.getRankings = async (req, res) => {
  try {
    const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'xp';
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const rankings = await leaderboardService.getRankings(sortBy, limit);

    res.json({
      status: 'success',
      message: 'Leaderboard retrieved successfully',
      data: rankings,
    });
  } catch (error) {
    console.error('Error fetching leaderboard rankings:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.searchPlayers = async (req, res) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : '';
    const players = await leaderboardService.searchPlayers(query);

    res.json({
      status: 'success',
      message: 'Players retrieved successfully',
      data: players,
    });
  } catch (error) {
    console.error('Error searching players:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
