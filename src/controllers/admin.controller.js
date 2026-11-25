const adminService = require('../services/admin.service');

const ALLOWED_ROLES = ['USER', 'ADMIN'];
const ALLOWED_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const ALLOWED_ITEM_TYPES = ['CHARACTER', 'OUTFIT', 'ACCESSORY'];
const ALLOWED_RARITIES = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];

const isValidOptionsArray = (options) => {
  if (!Array.isArray(options) || options.length < 2) {
    return false;
  }
  return options.every(
    (opt) =>
      opt &&
      typeof opt === 'object' &&
      typeof opt.id === 'string' &&
      typeof opt.textTh === 'string' &&
      typeof opt.textEn === 'string'
  );
};

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await adminService.getAnalytics();

    res.json({
      status: 'success',
      message: 'Analytics retrieved successfully',
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await adminService.listUsers();

    res.json({
      status: 'success',
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { displayName, username, role, isActive, coins } = req.body || {};
    const payload = {};

    if (displayName !== undefined) {
      if (typeof displayName !== 'string' || displayName.length < 1 || displayName.length > 100) {
        return res.status(400).json({
          status: 'error',
          message: 'ชื่อที่แสดงต้องยาว 1 ถึง 100 ตัวอักษร',
        });
      }
      payload.displayName = displayName;
    }

    if (username !== undefined) {
      if (typeof username !== 'string' || username.length < 2 || username.length > 50) {
        return res.status(400).json({
          status: 'error',
          message: 'ชื่อผู้ใช้ต้องยาว 2 ถึง 50 ตัวอักษร',
        });
      }
      payload.username = username;
    }

    if (role !== undefined) {
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({
          status: 'error',
          message: 'สิทธิ์ผู้ใช้ไม่ถูกต้อง (รองรับ USER หรือ ADMIN)',
        });
      }
      payload.role = role;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          status: 'error',
          message: 'สถานะการใช้งานไม่ถูกต้อง',
        });
      }
      payload.isActive = isActive;
    }

    if (coins !== undefined) {
      if (!Number.isInteger(coins) || coins < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'จำนวนเหรียญต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป',
        });
      }
      payload.coins = coins;
    }

    const updatedUser = await adminService.updateUser(String(req.params.id), payload);

    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const targetId = String(req.params.id);

    if (req.user && req.user.id === targetId) {
      return res.status(400).json({
        status: 'error',
        message: 'ไม่สามารถลบบัญชีผู้ดูแลระบบที่กำลังใช้งานอยู่ได้',
      });
    }

    await adminService.deleteUser(targetId);

    res.json({
      status: 'success',
      message: 'User deleted successfully',
      data: { id: targetId },
    });
  } catch (error) {
    console.error('Error deleting user for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.listQuestions = async (req, res) => {
  try {
    const questions = await adminService.listQuestions();

    res.json({
      status: 'success',
      message: 'Questions retrieved successfully',
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching questions for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const {
      categoryId,
      difficulty,
      questionType = 'MULTIPLE_CHOICE',
      promptTh,
      promptEn,
      optionsJson,
      correctOptionId,
      explanationTh,
      explanationEn,
      imageUrl,
      points = 100,
      timeLimitSeconds = 30,
      isActive = true,
    } = req.body || {};

    if (typeof categoryId !== 'string' || categoryId.length < 1) {
      return res.status(400).json({ status: 'error', message: 'กรุณาระบุรหัสหมวดหมู่' });
    }
    if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ status: 'error', message: 'ระดับความยากไม่ถูกต้อง' });
    }
    if (typeof questionType !== 'string') {
      return res.status(400).json({ status: 'error', message: 'ประเภทโจทย์ไม่ถูกต้อง' });
    }
    if (typeof promptTh !== 'string' || promptTh.length < 1) {
      return res.status(400).json({ status: 'error', message: 'กรุณากรอกโจทย์ภาษาไทย' });
    }
    if (typeof promptEn !== 'string' || promptEn.length < 1) {
      return res.status(400).json({ status: 'error', message: 'กรุณากรอกโจทย์ภาษาอังกฤษ' });
    }
    if (!isValidOptionsArray(optionsJson)) {
      return res.status(400).json({ status: 'error', message: 'ตัวเลือกคำตอบต้องมีอย่างน้อย 2 ข้อและรูปแบบถูกต้อง' });
    }
    if (typeof correctOptionId !== 'string' || correctOptionId.length < 1) {
      return res.status(400).json({ status: 'error', message: 'กรุณาระบุตัวเลือกคำตอบที่ถูกต้อง' });
    }
    if (typeof explanationTh !== 'string' || explanationTh.length < 1) {
      return res.status(400).json({ status: 'error', message: 'กรุณากรอกคำอธิบายภาษาไทย' });
    }
    if (typeof explanationEn !== 'string' || explanationEn.length < 1) {
      return res.status(400).json({ status: 'error', message: 'กรุณากรอกคำอธิบายภาษาอังกฤษ' });
    }
    if (imageUrl !== undefined && imageUrl !== null && typeof imageUrl !== 'string') {
      return res.status(400).json({ status: 'error', message: 'ลิงก์รูปภาพไม่ถูกต้อง' });
    }
    if (!Number.isInteger(points) || points < 10) {
      return res.status(400).json({ status: 'error', message: 'คะแนนต้องเป็นจำนวนเต็มตั้งแต่ 10 ขึ้นไป' });
    }
    if (!Number.isInteger(timeLimitSeconds) || timeLimitSeconds < 5) {
      return res.status(400).json({ status: 'error', message: 'เวลาจำกัดต้องเป็นจำนวนเต็มตั้งแต่ 5 วินาทีขึ้นไป' });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ status: 'error', message: 'สถานะการใช้งานไม่ถูกต้อง' });
    }

    const createdQuestion = await adminService.createQuestion({
      categoryId,
      difficulty,
      questionType,
      promptTh,
      promptEn,
      optionsJson,
      correctOptionId,
      explanationTh,
      explanationEn,
      imageUrl,
      points,
      timeLimitSeconds,
      isActive,
      createdBy: req.user?.id,
    });

    res.json({
      status: 'success',
      message: 'Question created successfully',
      data: createdQuestion,
    });
  } catch (error) {
    console.error('Error creating question for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const {
      categoryId,
      difficulty,
      questionType,
      promptTh,
      promptEn,
      optionsJson,
      correctOptionId,
      explanationTh,
      explanationEn,
      imageUrl,
      points,
      timeLimitSeconds,
      isActive,
    } = req.body || {};

    const payload = {};

    if (categoryId !== undefined) {
      if (typeof categoryId !== 'string' || categoryId.length < 1) {
        return res.status(400).json({ status: 'error', message: 'รหัสหมวดหมู่ไม่ถูกต้อง' });
      }
      payload.categoryId = categoryId;
    }
    if (difficulty !== undefined) {
      if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
        return res.status(400).json({ status: 'error', message: 'ระดับความยากไม่ถูกต้อง' });
      }
      payload.difficulty = difficulty;
    }
    if (questionType !== undefined) {
      if (typeof questionType !== 'string') {
        return res.status(400).json({ status: 'error', message: 'ประเภทโจทย์ไม่ถูกต้อง' });
      }
      payload.questionType = questionType;
    }
    if (promptTh !== undefined) {
      if (typeof promptTh !== 'string' || promptTh.length < 1) {
        return res.status(400).json({ status: 'error', message: 'โจทย์ภาษาไทยไม่ถูกต้อง' });
      }
      payload.promptTh = promptTh;
    }
    if (promptEn !== undefined) {
      if (typeof promptEn !== 'string' || promptEn.length < 1) {
        return res.status(400).json({ status: 'error', message: 'โจทย์ภาษาอังกฤษไม่ถูกต้อง' });
      }
      payload.promptEn = promptEn;
    }
    if (optionsJson !== undefined) {
      if (!isValidOptionsArray(optionsJson)) {
        return res.status(400).json({ status: 'error', message: 'ตัวเลือกคำตอบไม่ถูกต้อง' });
      }
      payload.optionsJson = optionsJson;
    }
    if (correctOptionId !== undefined) {
      if (typeof correctOptionId !== 'string' || correctOptionId.length < 1) {
        return res.status(400).json({ status: 'error', message: 'ตัวเลือกคำตอบที่ถูกต้องไม่ถูกต้อง' });
      }
      payload.correctOptionId = correctOptionId;
    }
    if (explanationTh !== undefined) {
      if (typeof explanationTh !== 'string' || explanationTh.length < 1) {
        return res.status(400).json({ status: 'error', message: 'คำอธิบายภาษาไทยไม่ถูกต้อง' });
      }
      payload.explanationTh = explanationTh;
    }
    if (explanationEn !== undefined) {
      if (typeof explanationEn !== 'string' || explanationEn.length < 1) {
        return res.status(400).json({ status: 'error', message: 'คำอธิบายภาษาอังกฤษไม่ถูกต้อง' });
      }
      payload.explanationEn = explanationEn;
    }
    if (imageUrl !== undefined) {
      if (imageUrl !== null && typeof imageUrl !== 'string') {
        return res.status(400).json({ status: 'error', message: 'ลิงก์รูปภาพไม่ถูกต้อง' });
      }
      payload.imageUrl = imageUrl;
    }
    if (points !== undefined) {
      if (!Number.isInteger(points) || points < 10) {
        return res.status(400).json({ status: 'error', message: 'คะแนนต้องเป็นจำนวนเต็มตั้งแต่ 10 ขึ้นไป' });
      }
      payload.points = points;
    }
    if (timeLimitSeconds !== undefined) {
      if (!Number.isInteger(timeLimitSeconds) || timeLimitSeconds < 5) {
        return res.status(400).json({ status: 'error', message: 'เวลาจำกัดต้องเป็นจำนวนเต็มตั้งแต่ 5 วินาทีขึ้นไป' });
      }
      payload.timeLimitSeconds = timeLimitSeconds;
    }
    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ status: 'error', message: 'สถานะการใช้งานไม่ถูกต้อง' });
      }
      payload.isActive = isActive;
    }

    const updatedQuestion = await adminService.updateQuestion(String(req.params.id), payload);

    res.json({
      status: 'success',
      message: 'Question updated successfully',
      data: updatedQuestion,
    });
  } catch (error) {
    console.error('Error updating question for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await adminService.deleteQuestion(String(req.params.id));

    res.json({
      status: 'success',
      message: 'Question deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('Error deleting question for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.upsertCategory = async (req, res) => {
  try {
    const {
      id,
      slug,
      nameTh,
      nameEn,
      descriptionTh,
      descriptionEn,
      icon,
      color,
      sortOrder = 0,
      isActive = true,
    } = req.body || {};

    if (typeof id !== 'string' || id.length < 1 || id.length > 64) {
      return res.status(400).json({ status: 'error', message: 'รหัสหมวดหมู่ต้องยาว 1 ถึง 64 ตัวอักษร' });
    }
    if (typeof slug !== 'string' || slug.length < 1 || slug.length > 64) {
      return res.status(400).json({ status: 'error', message: 'slug ต้องยาว 1 ถึง 64 ตัวอักษร' });
    }
    if (typeof nameTh !== 'string' || nameTh.length < 1 || nameTh.length > 120) {
      return res.status(400).json({ status: 'error', message: 'ชื่อหมวดหมู่ภาษาไทยต้องยาว 1 ถึง 120 ตัวอักษร' });
    }
    if (typeof nameEn !== 'string' || nameEn.length < 1 || nameEn.length > 120) {
      return res.status(400).json({ status: 'error', message: 'ชื่อหมวดหมู่ภาษาอังกฤษต้องยาว 1 ถึง 120 ตัวอักษร' });
    }
    if (descriptionTh !== undefined && typeof descriptionTh !== 'string') {
      return res.status(400).json({ status: 'error', message: 'คำอธิบายภาษาไทยไม่ถูกต้อง' });
    }
    if (descriptionEn !== undefined && typeof descriptionEn !== 'string') {
      return res.status(400).json({ status: 'error', message: 'คำอธิบายภาษาอังกฤษไม่ถูกต้อง' });
    }
    if (typeof icon !== 'string' || icon.length < 1 || icon.length > 64) {
      return res.status(400).json({ status: 'error', message: 'ไอคอนต้องยาว 1 ถึง 64 ตัวอักษร' });
    }
    if (typeof color !== 'string' || color.length < 1 || color.length > 32) {
      return res.status(400).json({ status: 'error', message: 'รหัสสีต้องยาว 1 ถึง 32 ตัวอักษร' });
    }
    if (!Number.isInteger(sortOrder)) {
      return res.status(400).json({ status: 'error', message: 'ลำดับการเรียงต้องเป็นจำนวนเต็ม' });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ status: 'error', message: 'สถานะการใช้งานไม่ถูกต้อง' });
    }

    const savedCategory = await adminService.upsertCategory(id, {
      id,
      slug,
      nameTh,
      nameEn,
      descriptionTh,
      descriptionEn,
      icon,
      color,
      sortOrder,
      isActive,
    });

    res.json({
      status: 'success',
      message: 'Category saved successfully',
      data: savedCategory,
    });
  } catch (error) {
    console.error('Error saving category for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.upsertShopItem = async (req, res) => {
  try {
    const {
      id,
      itemType,
      nameTh,
      nameEn,
      descriptionTh,
      descriptionEn,
      rarity = 'COMMON',
      priceCoins,
      requiredLevel = 1,
      previewConfig = {},
      isAvailable = true,
    } = req.body || {};

    if (typeof id !== 'string' || id.length < 1 || id.length > 64) {
      return res.status(400).json({ status: 'error', message: 'รหัสไอเทมต้องยาว 1 ถึง 64 ตัวอักษร' });
    }
    if (!ALLOWED_ITEM_TYPES.includes(itemType)) {
      return res.status(400).json({ status: 'error', message: 'ประเภทไอเทมไม่ถูกต้อง' });
    }
    if (typeof nameTh !== 'string' || nameTh.length < 1 || nameTh.length > 120) {
      return res.status(400).json({ status: 'error', message: 'ชื่อไอเทมภาษาไทยต้องยาว 1 ถึง 120 ตัวอักษร' });
    }
    if (typeof nameEn !== 'string' || nameEn.length < 1 || nameEn.length > 120) {
      return res.status(400).json({ status: 'error', message: 'ชื่อไอเทมภาษาอังกฤษต้องยาว 1 ถึง 120 ตัวอักษร' });
    }
    if (descriptionTh !== undefined && typeof descriptionTh !== 'string') {
      return res.status(400).json({ status: 'error', message: 'คำอธิบายภาษาไทยไม่ถูกต้อง' });
    }
    if (descriptionEn !== undefined && typeof descriptionEn !== 'string') {
      return res.status(400).json({ status: 'error', message: 'คำอธิบายภาษาอังกฤษไม่ถูกต้อง' });
    }
    if (!ALLOWED_RARITIES.includes(rarity)) {
      return res.status(400).json({ status: 'error', message: 'ระดับความหายากไม่ถูกต้อง' });
    }
    if (!Number.isInteger(priceCoins) || priceCoins < 0) {
      return res.status(400).json({ status: 'error', message: 'ราคาเหรียญต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป' });
    }
    if (!Number.isInteger(requiredLevel) || requiredLevel < 1) {
      return res.status(400).json({ status: 'error', message: 'เลเวลขั้นต่ำต้องเป็นจำนวนเต็มตั้งแต่ 1 ขึ้นไป' });
    }
    if (typeof previewConfig !== 'object' || previewConfig === null || Array.isArray(previewConfig)) {
      return res.status(400).json({ status: 'error', message: 'ข้อมูล previewConfig ต้องเป็นออบเจ็กต์' });
    }
    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ status: 'error', message: 'สถานะการวางขายไม่ถูกต้อง' });
    }

    const savedShopItem = await adminService.upsertShopItem(id, {
      id,
      itemType,
      nameTh,
      nameEn,
      descriptionTh,
      descriptionEn,
      rarity,
      priceCoins,
      requiredLevel,
      previewConfig,
      isAvailable,
    });

    res.json({
      status: 'success',
      message: 'Shop item saved successfully',
      data: savedShopItem,
    });
  } catch (error) {
    console.error('Error saving shop item for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = String(req.params.id);
    await adminService.deleteCategory(id);

    res.json({
      status: 'success',
      message: 'Category deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting category for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.deleteShopItem = async (req, res) => {
  try {
    const id = String(req.params.id);
    await adminService.deleteShopItem(id);

    res.json({
      status: 'success',
      message: 'Shop item deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting shop item for admin:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
