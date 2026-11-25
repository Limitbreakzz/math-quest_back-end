/**
 * Centralized Error Code Registry for MathQuest API.
 *
 * Numbering Convention:
 * - MQ-1xxx : Authentication & Authorization
 * - MQ-2xxx : Validation, Routing & Rate Limiting
 * - MQ-3xxx : User Profile
 * - MQ-4xxx : Game, Questions, Adventure & Sessions
 * - MQ-5xxx : Shop, Inventory & Economy
 * - MQ-6xxx : Missions & Achievements
 * - MQ-7xxx : Multiplayer Battle
 * - MQ-8xxx : Leaderboard & Admin
 * - MQ-9xxx : Database & System
 */
const ERROR_CODES = {
  // ---------------------------------------------------------------------------
  // MQ-1xxx: Authentication & Authorization
  // ---------------------------------------------------------------------------
  AUTH_MISSING_TOKEN: {
    number: 'MQ-1001',
    code: 'AUTH_MISSING_TOKEN',
    statusCode: 401,
    message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
  },
  AUTH_TOKEN_EXPIRED: {
    number: 'MQ-1002',
    code: 'AUTH_TOKEN_EXPIRED',
    statusCode: 401,
    message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง',
  },
  AUTH_INVALID_TOKEN: {
    number: 'MQ-1003',
    code: 'AUTH_INVALID_TOKEN',
    statusCode: 401,
    message: 'โทเค็นยืนยันตัวตนไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่',
  },
  AUTH_ACCOUNT_NOT_FOUND: {
    number: 'MQ-1004',
    code: 'AUTH_ACCOUNT_NOT_FOUND',
    statusCode: 404,
    message: 'ไม่พบบัญชีผู้ใช้นี้ กรุณาสมัครสมาชิกก่อนใช้งาน',
  },
  AUTH_DUPLICATE_ACCOUNT: {
    number: 'MQ-1005',
    code: 'AUTH_DUPLICATE_ACCOUNT',
    statusCode: 409,
    message: 'อีเมลหรือชื่อผู้ใช้นี้ถูกใช้งานแล้ว',
  },
  AUTH_ACCOUNT_DISABLED: {
    number: 'MQ-1006',
    code: 'AUTH_ACCOUNT_DISABLED',
    statusCode: 403,
    message: 'บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ',
  },
  AUTH_ACCESS_DENIED: {
    number: 'MQ-1007',
    code: 'AUTH_ACCESS_DENIED',
    statusCode: 403,
    message: 'คุณไม่มีสิทธิ์ดำเนินการนี้',
  },
  AUTH_REGISTER_FAILED: {
    number: 'MQ-1008',
    code: 'AUTH_REGISTER_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถสมัครสมาชิกได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
  },
  AUTH_LOGIN_FAILED: {
    number: 'MQ-1009',
    code: 'AUTH_LOGIN_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถเข้าสู่ระบบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
  },
  AUTH_DEMO_LOGIN_FAILED: {
    number: 'MQ-1010',
    code: 'AUTH_DEMO_LOGIN_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถเข้าสู่โหมดทดลองใช้งานได้ในขณะนี้',
  },

  // ---------------------------------------------------------------------------
  // MQ-2xxx: Validation, Routing & Rate Limiting
  // ---------------------------------------------------------------------------
  VALIDATION_FAILED: {
    number: 'MQ-2001',
    code: 'VALIDATION_FAILED',
    statusCode: 400,
    message: 'ข้อมูลที่ส่งมาไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง',
  },
  ROUTE_NOT_FOUND: {
    number: 'MQ-2002',
    code: 'ROUTE_NOT_FOUND',
    statusCode: 404,
    message: 'ไม่พบเส้นทาง API ที่ร้องขอ',
  },
  RESOURCE_NOT_FOUND: {
    number: 'MQ-2003',
    code: 'RESOURCE_NOT_FOUND',
    statusCode: 404,
    message: 'ไม่พบข้อมูลที่ต้องการ',
  },
  DUPLICATE_RECORD: {
    number: 'MQ-2004',
    code: 'DUPLICATE_RECORD',
    statusCode: 409,
    message: 'ข้อมูลนี้มีอยู่ในระบบแล้ว',
  },
  RATE_LIMIT_EXCEEDED: {
    number: 'MQ-2005',
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429,
    message: 'คุณส่งคำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่',
  },

  // ---------------------------------------------------------------------------
  // MQ-3xxx: Profile
  // ---------------------------------------------------------------------------
  PROFILE_NOT_FOUND: {
    number: 'MQ-3001',
    code: 'PROFILE_NOT_FOUND',
    statusCode: 404,
    message: 'ไม่พบข้อมูลโปรไฟล์ผู้เล่น',
  },
  USERNAME_ALREADY_TAKEN: {
    number: 'MQ-3002',
    code: 'USERNAME_ALREADY_TAKEN',
    statusCode: 409,
    message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น',
  },
  PROFILE_FETCH_FAILED: {
    number: 'MQ-3003',
    code: 'PROFILE_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลโปรไฟล์ผู้เล่นได้',
  },
  PROFILE_UPDATE_FAILED: {
    number: 'MQ-3004',
    code: 'PROFILE_UPDATE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถอัปเดตข้อมูลโปรไฟล์ได้',
  },

  // ---------------------------------------------------------------------------
  // MQ-4xxx: Game, Questions, Adventure & Sessions
  // ---------------------------------------------------------------------------
  GAME_CATEGORIES_FETCH_FAILED: {
    number: 'MQ-4001',
    code: 'GAME_CATEGORIES_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลหมวดหมู่คณิตศาสตร์ได้',
  },
  GAME_QUESTIONS_FETCH_FAILED: {
    number: 'MQ-4002',
    code: 'GAME_QUESTIONS_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลโจทย์คณิตศาสตร์ได้',
  },
  GAME_ADVENTURE_WORLDS_FAILED: {
    number: 'MQ-4003',
    code: 'GAME_ADVENTURE_WORLDS_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลโลกผจญภัยได้',
  },
  GAME_SESSION_SUBMIT_FAILED: {
    number: 'MQ-4004',
    code: 'GAME_SESSION_SUBMIT_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถบันทึกผลการเล่นเกมได้',
  },
  GAME_HISTORY_FETCH_FAILED: {
    number: 'MQ-4005',
    code: 'GAME_HISTORY_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงประวัติการเล่นเกมได้',
  },

  // ---------------------------------------------------------------------------
  // MQ-5xxx: Shop & Economy
  // ---------------------------------------------------------------------------
  SHOP_ITEM_NOT_FOUND: {
    number: 'MQ-5001',
    code: 'SHOP_ITEM_NOT_FOUND',
    statusCode: 404,
    message: 'ไม่พบไอเทมนี้ในร้านค้า หรือปิดการขายแล้ว',
  },
  SHOP_ITEM_ALREADY_OWNED: {
    number: 'MQ-5002',
    code: 'SHOP_ITEM_ALREADY_OWNED',
    statusCode: 409,
    message: 'คุณมีไอเทมนี้อยู่แล้ว',
  },
  SHOP_LEVEL_REQUIRED: {
    number: 'MQ-5003',
    code: 'SHOP_LEVEL_REQUIRED',
    statusCode: 400,
    message: 'เลเวลของคุณยังไม่ถึงเกณฑ์สำหรับไอเทมนี้',
  },
  SHOP_INSUFFICIENT_COINS: {
    number: 'MQ-5004',
    code: 'SHOP_INSUFFICIENT_COINS',
    statusCode: 400,
    message: 'เหรียญของคุณไม่เพียงพอสำหรับการซื้อรายการนี้',
  },
  SHOP_ITEM_NOT_OWNED: {
    number: 'MQ-5005',
    code: 'SHOP_ITEM_NOT_OWNED',
    statusCode: 403,
    message: 'คุณยังไม่ได้เป็นเจ้าของไอเทมนี้',
  },
  SHOP_ITEMS_FETCH_FAILED: {
    number: 'MQ-5006',
    code: 'SHOP_ITEMS_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงรายการไอเทมในร้านค้าได้',
  },
  SHOP_INVENTORY_FETCH_FAILED: {
    number: 'MQ-5007',
    code: 'SHOP_INVENTORY_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลคลังไอเทมได้',
  },
  SHOP_PURCHASE_FAILED: {
    number: 'MQ-5008',
    code: 'SHOP_PURCHASE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถทำรายการซื้อไอเทมได้',
  },
  SHOP_EQUIP_FAILED: {
    number: 'MQ-5009',
    code: 'SHOP_EQUIP_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถสวมใส่ไอเทมได้',
  },

  // ---------------------------------------------------------------------------
  // MQ-6xxx: Missions & Achievements
  // ---------------------------------------------------------------------------
  MISSION_NOT_FOUND: {
    number: 'MQ-6001',
    code: 'MISSION_NOT_FOUND',
    statusCode: 404,
    message: 'ไม่พบภารกิจที่ต้องการ',
  },
  MISSION_NOT_COMPLETED: {
    number: 'MQ-6002',
    code: 'MISSION_NOT_COMPLETED',
    statusCode: 400,
    message: 'ภารกิจนี้ยังไม่สำเร็จตามเป้าหมาย',
  },
  MISSION_ALREADY_CLAIMED: {
    number: 'MQ-6003',
    code: 'MISSION_ALREADY_CLAIMED',
    statusCode: 409,
    message: 'คุณได้รับรางวัลของภารกิจนี้ไปแล้ว',
  },
  MISSION_FETCH_FAILED: {
    number: 'MQ-6004',
    code: 'MISSION_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลภารกิจและความสำเร็จได้',
  },
  MISSION_CLAIM_FAILED: {
    number: 'MQ-6005',
    code: 'MISSION_CLAIM_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถรับรางวัลภารกิจได้',
  },

  // ---------------------------------------------------------------------------
  // MQ-7xxx: Multiplayer Battle
  // ---------------------------------------------------------------------------
  BATTLE_ROOM_NOT_FOUND: {
    number: 'MQ-7001',
    code: 'BATTLE_ROOM_NOT_FOUND',
    statusCode: 404,
    message: 'ไม่พบห้องประลองตามรหัสนี้ กรุณาตรวจสอบรหัสห้องอีกครั้ง',
  },
  BATTLE_ROOM_FULL: {
    number: 'MQ-7002',
    code: 'BATTLE_ROOM_FULL',
    statusCode: 409,
    message: 'ห้องประลองนี้มีผู้เล่นครบ 2 คนแล้ว',
  },
  BATTLE_MATCH_STARTED: {
    number: 'MQ-7003',
    code: 'BATTLE_MATCH_STARTED',
    statusCode: 400,
    message: 'ห้องประลองนี้เริ่มการแข่งขันไปแล้ว',
  },
  BATTLE_ROOM_CREATE_FAILED: {
    number: 'MQ-7004',
    code: 'BATTLE_ROOM_CREATE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถสร้างห้องประลองได้',
  },
  BATTLE_ROOM_JOIN_FAILED: {
    number: 'MQ-7005',
    code: 'BATTLE_ROOM_JOIN_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถเข้าร่วมห้องประลองได้',
  },
  BATTLE_ROOM_FETCH_FAILED: {
    number: 'MQ-7006',
    code: 'BATTLE_ROOM_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลห้องประลองได้',
  },

  // ---------------------------------------------------------------------------
  // MQ-8xxx: Leaderboard & Admin
  // ---------------------------------------------------------------------------
  LEADERBOARD_FETCH_FAILED: {
    number: 'MQ-8001',
    code: 'LEADERBOARD_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลอันดับผู้เล่นได้',
  },
  LEADERBOARD_SEARCH_FAILED: {
    number: 'MQ-8002',
    code: 'LEADERBOARD_SEARCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถค้นหาผู้เล่นได้',
  },
  ADMIN_ANALYTICS_FAILED: {
    number: 'MQ-8101',
    code: 'ADMIN_ANALYTICS_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงข้อมูลสถิติผู้ดูแลระบบได้',
  },
  ADMIN_USERS_FETCH_FAILED: {
    number: 'MQ-8102',
    code: 'ADMIN_USERS_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงรายชื่อผู้ใช้งานได้',
  },
  ADMIN_USER_UPDATE_FAILED: {
    number: 'MQ-8103',
    code: 'ADMIN_USER_UPDATE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถอัปเดตข้อมูลผู้ใช้งานได้',
  },
  ADMIN_QUESTIONS_FETCH_FAILED: {
    number: 'MQ-8104',
    code: 'ADMIN_QUESTIONS_FETCH_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถดึงรายการโจทย์ได้',
  },
  ADMIN_QUESTION_CREATE_FAILED: {
    number: 'MQ-8105',
    code: 'ADMIN_QUESTION_CREATE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถสร้างโจทย์ใหม่ได้',
  },
  ADMIN_QUESTION_UPDATE_FAILED: {
    number: 'MQ-8106',
    code: 'ADMIN_QUESTION_UPDATE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถแก้ไขโจทย์ได้',
  },
  ADMIN_QUESTION_DELETE_FAILED: {
    number: 'MQ-8107',
    code: 'ADMIN_QUESTION_DELETE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถลบโจทย์ได้',
  },
  ADMIN_CATEGORY_SAVE_FAILED: {
    number: 'MQ-8108',
    code: 'ADMIN_CATEGORY_SAVE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถบันทึกหมวดหมู่ได้',
  },
  ADMIN_SHOP_ITEM_SAVE_FAILED: {
    number: 'MQ-8109',
    code: 'ADMIN_SHOP_ITEM_SAVE_FAILED',
    statusCode: 500,
    message: 'ไม่สามารถบันทึกไอเทมร้านค้าได้',
  },

  // ---------------------------------------------------------------------------
  // MQ-9xxx: Database & System
  // ---------------------------------------------------------------------------
  DATABASE_CONNECTION_ERROR: {
    number: 'MQ-9001',
    code: 'DATABASE_CONNECTION_ERROR',
    statusCode: 503,
    message: 'ระบบฐานข้อมูลไม่พร้อมใช้งานชั่วคราว กรุณาลองใหม่อีกครั้ง',
  },
  DATABASE_ERROR: {
    number: 'MQ-9002',
    code: 'DATABASE_ERROR',
    statusCode: 500,
    message: 'เกิดข้อผิดพลาดในการบันทึกหรือดึงข้อมูล กรุณาลองใหม่อีกครั้ง',
  },
  INTERNAL_SERVER_ERROR: {
    number: 'MQ-9000',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    message: 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้งในภายหลัง',
  },
};

module.exports = ERROR_CODES;
