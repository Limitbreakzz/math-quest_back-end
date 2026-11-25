const missionService = require('../services/mission.service');

exports.getAll = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const missions = await missionService.getMissionsAndAchievements(req.user.id);

    res.json({
      status: 'success',
      message: 'Missions and achievements retrieved successfully',
      data: missions,
    });
  } catch (error) {
    console.error('Error fetching missions and achievements:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.claimMission = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const result = await missionService.claimMission(req.user.id, String(req.params.missionId));

    res.json({
      status: 'success',
      message: 'Mission reward claimed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error claiming mission reward:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
