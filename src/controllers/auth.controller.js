const authService = require('../services/auth.service');
const profileService = require('../services/profile.service');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ['USER', 'ADMIN'];

exports.register = async (req, res) => {
  try {
    const { email, username, displayName } = req.body || {};

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'กรุณากรอกอีเมลให้ถูกต้อง',
      });
    }

    if (typeof username !== 'string' || username.length < 2 || username.length > 50) {
      return res.status(400).json({
        status: 'error',
        message: 'ชื่อผู้ใช้ต้องมีความยาว 2 ถึง 50 ตัวอักษร',
      });
    }

    if (typeof displayName !== 'string' || displayName.length < 1 || displayName.length > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'ชื่อที่แสดงต้องมีความยาว 1 ถึง 100 ตัวอักษร',
      });
    }

    const result = await authService.register({ email, username, displayName });

    res.json({
      status: 'success',
      message: 'Account created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error registering user:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'กรุณากรอกอีเมลให้ถูกต้อง',
      });
    }

    const result = await authService.login({ email });

    res.json({
      status: 'success',
      message: 'Signed in successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error signing in user:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.loginDemo = async (req, res) => {
  try {
    const { role = 'USER' } = req.body || {};

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'ประเภทบัญชีทดลองไม่ถูกต้อง',
      });
    }

    const result = await authService.loginDemo(role);

    res.json({
      status: 'success',
      message: 'Demo session initialized',
      data: result,
    });
  } catch (error) {
    console.error('Error initializing demo session:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.me = async (req, res) => {
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
      message: 'Current user retrieved',
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
