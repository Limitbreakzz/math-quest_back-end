const profileService = require('../services/profile.service');

const ALLOWED_LANGUAGES = ['th', 'en'];

const isValidUrl = (value) => {
  if (value.startsWith('data:image/')) {
    return true;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const profile = await profileService.getById(req.user.id);

    res.json({
      status: 'success',
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching current user profile:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const { displayName, username, avatarUrl, preferredLanguage } = req.body || {};
    const payload = {};

    if (displayName !== undefined) {
      if (typeof displayName !== 'string' || displayName.length < 1 || displayName.length > 100) {
        return res.status(400).json({
          status: 'error',
          message: 'ชื่อที่แสดงต้องเป็นข้อความยาว 1 ถึง 100 ตัวอักษร',
        });
      }
      payload.displayName = displayName;
    }

    if (username !== undefined) {
      if (typeof username !== 'string' || username.length < 2 || username.length > 50) {
        return res.status(400).json({
          status: 'error',
          message: 'ชื่อผู้ใช้ต้องเป็นข้อความยาว 2 ถึง 50 ตัวอักษร',
        });
      }
      payload.username = username;
    }

    if (avatarUrl !== undefined) {
      if (avatarUrl !== null && (typeof avatarUrl !== 'string' || !isValidUrl(avatarUrl))) {
        return res.status(400).json({
          status: 'error',
          message: 'ลิงก์รูปโปรไฟล์ไม่ถูกต้อง',
        });
      }
      payload.avatarUrl = avatarUrl;
    }

    if (preferredLanguage !== undefined) {
      if (!ALLOWED_LANGUAGES.includes(preferredLanguage)) {
        return res.status(400).json({
          status: 'error',
          message: 'ภาษาที่เลือกไม่ถูกต้อง (รองรับ th หรือ en)',
        });
      }
      payload.preferredLanguage = preferredLanguage;
    }

    const updatedProfile = await profileService.updateProfile(req.user.id, payload);

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const profile = await profileService.getById(String(req.params.id));

    res.json({
      status: 'success',
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
