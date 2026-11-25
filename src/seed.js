const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MathQuest database...');

  // 1. Mathematics Categories (9 Categories)
  const categories = [
    { id: 'arithmetic', slug: 'arithmetic', nameTh: 'คณิตศาสตร์พื้นฐาน', nameEn: 'Basic Arithmetic', descriptionTh: 'บวก ลบ คูณ หาร เพื่อสร้างพื้นฐานอันแข็งแกร่ง', descriptionEn: 'Addition, Subtraction, Multiplication, and Division fundamentals', icon: 'Calculator', color: '#3B82F6', sortOrder: 1 },
    { id: 'fractions', slug: 'fractions', nameTh: 'เศษส่วน', nameEn: 'Fractions', descriptionTh: 'เรียนรู้การบวก ลบ คูณ หาร และเปรียบเทียบเศษส่วน', descriptionEn: 'Master adding, subtracting, multiplying, and comparing fractions', icon: 'PieChart', color: '#8B5CF6', sortOrder: 2 },
    { id: 'percentages', slug: 'percentages', nameTh: 'ร้อยละและเปอร์เซ็นต์', nameEn: 'Percentages', descriptionTh: 'คำนวณส่วนลด ดอกเบี้ย และอัตราส่วนร้อยละ', descriptionEn: 'Calculate discounts, ratios, growth, and percentages', icon: 'Percent', color: '#EC4899', sortOrder: 3 },
    { id: 'algebra', slug: 'algebra', nameTh: 'พีชคณิต', nameEn: 'Algebra', descriptionTh: 'แก้สมการ ตัวแปร และนิพจน์ทางพีชคณิต', descriptionEn: 'Solve equations, variables, and algebraic expressions', icon: 'Variable', color: '#F59E0B', sortOrder: 4 },
    { id: 'geometry', slug: 'geometry', nameTh: 'เรขาคณิต', nameEn: 'Geometry', descriptionTh: 'พื้นที่ เส้นรอบรูป มุม และรูปทรงเรขาคณิต', descriptionEn: 'Areas, perimeters, angles, and geometric shapes', icon: 'Triangle', color: '#10B981', sortOrder: 5 },
    { id: 'statistics', slug: 'statistics', nameTh: 'สถิติ', nameEn: 'Statistics', descriptionTh: 'ค่าเฉลี่ย มัธยฐาน ฐานนิยม และการวิเคราะห์ข้อมูล', descriptionEn: 'Mean, median, mode, range, and data analysis', icon: 'BarChart3', color: '#06B6D4', sortOrder: 6 },
    { id: 'probability', slug: 'probability', nameTh: 'ความน่าจะเป็น', nameEn: 'Probability', descriptionTh: 'คำนวณโอกาสของเหตุการณ์ในชีวิตจริงและเกม', descriptionEn: 'Calculate likelihoods, dice rolls, and event odds', icon: 'Dices', color: '#6366F1', sortOrder: 7 },
    { id: 'logic', slug: 'logic', nameTh: 'การใช้เหตุผลเชิงตรรกะ', nameEn: 'Logical Reasoning', descriptionTh: 'อนุกรม รูปแบบ และการวิเคราะห์เชิงตรรกะ', descriptionEn: 'Sequences, patterns, deductions, and logical puzzles', icon: 'Brain', color: '#EF4444', sortOrder: 8 },
    { id: 'word_problems', slug: 'word-problems', nameTh: 'โจทย์ปัญหาคณิตศาสตร์', nameEn: 'Mathematical Word Problems', descriptionTh: 'ประยุกต์คณิตศาสตร์แก้สถานการณ์ในชีวิตประจำวัน', descriptionEn: 'Apply mathematics to solve real-world scenarios', icon: 'BookOpen', color: '#14B8A6', sortOrder: 9 },
  ];

  for (const cat of categories) {
    await prisma.mathCategory.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  // 2. Game Modes
  const modes = [
    { id: 'quiz', code: 'QUIZ', nameTh: 'ควิซคณิตศาสตร์', nameEn: 'Math Quiz', descriptionTh: 'ทดสอบความรู้แบบปรนัยพร้อมตัวจับเวลาและคำอธิบายละเอียด', descriptionEn: 'Configurable multiple-choice challenges with timer and explanations', baseXpReward: 60, baseCoinReward: 30 },
    { id: 'speed', code: 'SPEED', nameTh: 'สปีดคณิตศาสตร์', nameEn: 'Math Speed', descriptionTh: 'แข่งกับเวลา ตอบให้ไวและแม่นยำเพื่อทำคอมโบสูงสุด', descriptionEn: 'Race the clock, build combos, and set personal high scores', baseXpReward: 80, baseCoinReward: 45 },
    { id: 'adventure', code: 'ADVENTURE', nameTh: 'ผจญภัยโลกคณิตศาสตร์', nameEn: 'Math Adventure', descriptionTh: 'ตะลุย 5 อาณาจักร ปลดล็อกด่านและปราบบอสสุดท้าทาย', descriptionEn: 'Explore 5 themed worlds, unlock stages, and defeat bosses', baseXpReward: 100, baseCoinReward: 60 },
    { id: 'battle', code: 'BATTLE', nameTh: 'แบทเทิล 1 ต่อ 1', nameEn: 'Math Battle', descriptionTh: 'ประลองความไวและความแม่นยำกับเพื่อนแบบเรียลไทม์', descriptionEn: 'Real-time 1v1 multiplayer matches with private room codes', baseXpReward: 120, baseCoinReward: 75 },
    { id: 'puzzle', code: 'PUZZLE', nameTh: 'ปริศนาตัวเลข', nameEn: 'Math Puzzle', descriptionTh: 'ไขปริศนาตัวเลขที่หายไป รูปแบบ และสมการลับ', descriptionEn: 'Solve missing numbers, mathematical patterns, and logic equations', baseXpReward: 75, baseCoinReward: 40 },
    { id: 'daily', code: 'DAILY', nameTh: 'ภารกิจท้าทายประจำวัน', nameEn: 'Daily Challenge', descriptionTh: 'โจทย์พิเศษประจำวัน จำกัดรอบ ลุ้นอันดับและรางวัลใหญ่', descriptionEn: 'Special daily challenge with limited attempts and leaderboard', baseXpReward: 200, baseCoinReward: 120 },
  ];

  for (const mode of modes) {
    await prisma.gameMode.upsert({
      where: { id: mode.id },
      update: mode,
      create: mode,
    });
  }

  // 3. Adventure Worlds & Stages
  const worlds = [
    { id: 'world_1', worldNumber: 1, nameTh: 'อาณาจักรการบวกและลบ', nameEn: 'Addition & Subtraction Kingdom', descriptionTh: 'เริ่มต้นการผจญภัยในปราสาทแห่งตัวเลขพื้นฐาน', descriptionEn: 'Begin your journey in the sunlit kingdom of sums and differences', themeColor: '#3B82F6', icon: 'Castle', categoryId: 'arithmetic', requiredLevel: 1, rewardXp: 250, rewardCoins: 120 },
    { id: 'world_2', worldNumber: 2, nameTh: 'ป่าแห่งการคูณและหาร', nameEn: 'Multiplication & Division Forest', descriptionTh: 'ผจญภัยในป่าลึกที่เต็มไปด้วยปริศนาสูตรคูณและการแบ่งส่วน', descriptionEn: 'Navigate the enchanted forest of products and quotients', themeColor: '#10B981', icon: 'Trees', categoryId: 'arithmetic', requiredLevel: 2, rewardXp: 350, rewardCoins: 180 },
    { id: 'world_3', worldNumber: 3, nameTh: 'ดินแดนลึกลับแห่งเศษส่วน', nameEn: 'Fraction Mystery Land', descriptionTh: 'ไขความลับแห่งส่วนแบ่ง เปอร์เซ็นต์ และอัตราส่วน', descriptionEn: 'Uncover ancient secrets of fractions and percentages', themeColor: '#8B5CF6', icon: 'Sparkles', categoryId: 'fractions', requiredLevel: 3, rewardXp: 450, rewardCoins: 240 },
    { id: 'world_4', worldNumber: 4, nameTh: 'ปราสาทพีชคณิต', nameEn: 'Algebra Castle', descriptionTh: 'พิชิตสมการและตัวแปรเพื่อโค่นราชาแห่ง X', descriptionEn: 'Conquer equations and variables in the fortress of X', themeColor: '#F59E0B', icon: 'Crown', categoryId: 'algebra', requiredLevel: 5, rewardXp: 600, rewardCoins: 320 },
    { id: 'world_5', worldNumber: 5, nameTh: 'อาณาจักรเรขาคณิต', nameEn: 'Geometry Kingdom', descriptionTh: 'ผจญภัยในมิติแห่งรูปทรง มุม และทฤษฎีบทในตำนาน', descriptionEn: 'Master shapes, angles, and legendary theorems in the sky realm', themeColor: '#EC4899', icon: 'Compass', categoryId: 'geometry', requiredLevel: 7, rewardXp: 800, rewardCoins: 500 },
  ];

  for (const w of worlds) {
    await prisma.adventureWorld.upsert({ where: { id: w.id }, update: w, create: w });
  }

  const stages = [
    { id: 'w1_s1', worldId: 'world_1', stageNumber: 1, nameTh: 'ประตูเมืองผลบวก', nameEn: 'Gate of Sums', difficulty: 'EASY', isBoss: false, questionCount: 5, rewardXp: 60, rewardCoins: 30 },
    { id: 'w1_s2', worldId: 'world_1', stageNumber: 2, nameTh: 'สะพานแห่งการลบ', nameEn: 'Bridge of Differences', difficulty: 'EASY', isBoss: false, questionCount: 5, rewardXp: 70, rewardCoins: 35 },
    { id: 'w1_s3', worldId: 'world_1', stageNumber: 3, nameTh: 'หอคอยคิดเลขเร็ว', nameEn: 'Tower of Mental Math', difficulty: 'MEDIUM', isBoss: false, questionCount: 6, rewardXp: 90, rewardCoins: 45 },
    { id: 'w1_boss', worldId: 'world_1', stageNumber: 4, nameTh: 'บอส: อัศวินพลัสไมนัส', nameEn: 'Boss: Knight Plus-Minus', difficulty: 'MEDIUM', isBoss: true, bossNameTh: 'อัศวินพลัสไมนัส', bossNameEn: 'Knight Plus-Minus', bossHp: 100, questionCount: 7, rewardXp: 180, rewardCoins: 100 },

    { id: 'w2_s1', worldId: 'world_2', stageNumber: 1, nameTh: 'เส้นทางสูตรคูณ', nameEn: 'Multiplication Trail', difficulty: 'EASY', isBoss: false, questionCount: 5, rewardXp: 80, rewardCoins: 40 },
    { id: 'w2_s2', worldId: 'world_2', stageNumber: 2, nameTh: 'ลำธารแห่งการหาร', nameEn: 'Division Creek', difficulty: 'MEDIUM', isBoss: false, questionCount: 6, rewardXp: 95, rewardCoins: 50 },
    { id: 'w2_s3', worldId: 'world_2', stageNumber: 3, nameTh: 'เขาวงกตตัวประกอบ', nameEn: 'Factor Labyrinth', difficulty: 'MEDIUM', isBoss: false, questionCount: 6, rewardXp: 110, rewardCoins: 60 },
    { id: 'w2_boss', worldId: 'world_2', stageNumber: 4, nameTh: 'บอส: มังกรสูตรคูณ', nameEn: 'Boss: Multiplier Dragon', difficulty: 'HARD', isBoss: true, bossNameTh: 'มังกรสูตรคูณ', bossNameEn: 'Multiplier Dragon', bossHp: 120, questionCount: 7, rewardXp: 220, rewardCoins: 130 },

    { id: 'w3_s1', worldId: 'world_3', stageNumber: 1, nameTh: 'หมู่บ้านครึ่งหนึ่ง', nameEn: 'Halfway Village', difficulty: 'EASY', isBoss: false, questionCount: 5, rewardXp: 100, rewardCoins: 50 },
    { id: 'w3_s2', worldId: 'world_3', stageNumber: 2, nameTh: 'ถ้ำเศษส่วนแท้', nameEn: 'Cavern of Fractions', difficulty: 'MEDIUM', isBoss: false, questionCount: 6, rewardXp: 120, rewardCoins: 65 },
    { id: 'w3_s3', worldId: 'world_3', stageNumber: 3, nameTh: 'ตลาดร้อยละ', nameEn: 'Percentage Bazaar', difficulty: 'MEDIUM', isBoss: false, questionCount: 6, rewardXp: 140, rewardCoins: 75 },
    { id: 'w3_boss', worldId: 'world_3', stageNumber: 4, nameTh: 'บอส: จอมเวทย์เศษส่วน', nameEn: 'Boss: Fraction Sorcerer', difficulty: 'HARD', isBoss: true, bossNameTh: 'จอมเวทย์เศษส่วน', bossNameEn: 'Fraction Sorcerer', bossHp: 140, questionCount: 8, rewardXp: 280, rewardCoins: 160 },

    { id: 'w4_s1', worldId: 'world_4', stageNumber: 1, nameTh: 'ลานฝึกตัวแปร X', nameEn: 'Variable Courtyard', difficulty: 'EASY', isBoss: false, questionCount: 5, rewardXp: 120, rewardCoins: 65 },
    { id: 'w4_s2', worldId: 'world_4', stageNumber: 2, nameTh: 'ห้องโถงสมการเชิงเส้น', nameEn: 'Hall of Linear Equations', difficulty: 'MEDIUM', isBoss: false, questionCount: 6, rewardXp: 150, rewardCoins: 80 },
    { id: 'w4_s3', worldId: 'world_4', stageNumber: 3, nameTh: 'หอสมุดพหุนาม', nameEn: 'Polynomial Library', difficulty: 'HARD', isBoss: false, questionCount: 6, rewardXp: 180, rewardCoins: 95 },
    { id: 'w4_boss', worldId: 'world_4', stageNumber: 4, nameTh: 'บอส: ราชาพีชคณิต', nameEn: 'Boss: Algebra Overlord', difficulty: 'HARD', isBoss: true, bossNameTh: 'ราชาพีชคณิต', bossNameEn: 'Algebra Overlord', bossHp: 160, questionCount: 8, rewardXp: 350, rewardCoins: 220 },

    { id: 'w5_s1', worldId: 'world_5', stageNumber: 1, nameTh: 'ทุ่งสามเหลี่ยม', nameEn: 'Triangle Plains', difficulty: 'EASY', isBoss: false, questionCount: 5, rewardXp: 140, rewardCoins: 75 },
    { id: 'w5_s2', worldId: 'world_5', stageNumber: 2, nameTh: 'วิหารวงกลมและพาย', nameEn: 'Temple of Pi', difficulty: 'MEDIUM', isBoss: false, questionCount: 6, rewardXp: 175, rewardCoins: 95 },
    { id: 'w5_s3', worldId: 'world_5', stageNumber: 3, nameTh: 'ป้อมปราการพีทาโกรัส', nameEn: 'Pythagoras Citadel', difficulty: 'HARD', isBoss: false, questionCount: 6, rewardXp: 210, rewardCoins: 115 },
    { id: 'w5_boss', worldId: 'world_5', stageNumber: 4, nameTh: 'บอส: เทพแห่งเรขาคณิต', nameEn: 'Boss: Geometry Titan', difficulty: 'HARD', isBoss: true, bossNameTh: 'เทพแห่งเรขาคณิต', bossNameEn: 'Geometry Titan', bossHp: 200, questionCount: 8, rewardXp: 500, rewardCoins: 300 },
  ];

  for (const s of stages) {
    await prisma.adventureStage.upsert({ where: { id: s.id }, update: s, create: s });
  }

  // 4. Shop Items
  const shopItems = [
    { id: 'char_nova', itemType: 'CHARACTER', nameTh: 'โนวา นักสำรวจตัวเลข', nameEn: 'Nova the Explorer', descriptionTh: 'นักผจญภัยรุ่นใหม่ผู้รักการไขปริศนาคณิตศาสตร์', descriptionEn: 'Energetic math explorer ready for any quest', rarity: 'COMMON', priceCoins: 0, requiredLevel: 1, previewConfig: { primary: '#6366F1', secondary: '#38BDF8', emoji: '🦊' } },
    { id: 'char_pixel', itemType: 'CHARACTER', nameTh: 'พิกเซล หุ่นยนต์อัจฉริยะ', nameEn: 'Pixel the Cyber Bot', descriptionTh: 'หุ่นยนต์คำนวณความเร็วสูงจากโลกอนาคต', descriptionEn: 'High-speed calculation bot from the future', rarity: 'RARE', priceCoins: 300, requiredLevel: 1, previewConfig: { primary: '#06B6D4', secondary: '#22D3EE', emoji: '🤖' } },
    { id: 'char_luna', itemType: 'CHARACTER', nameTh: 'ลูน่า จอมเวทย์ดวงดาว', nameEn: 'Luna Star Mage', descriptionTh: 'จอมเวทย์สาวผู้ควบคุมพลังแห่งเรขาคณิตและดวงดาว', descriptionEn: 'Celestial mage channeling geometric starlight', rarity: 'EPIC', priceCoins: 650, requiredLevel: 3, previewConfig: { primary: '#A855F7', secondary: '#F472B6', emoji: '🧙‍♀️' } },
    { id: 'char_draco', itemType: 'CHARACTER', nameTh: 'ดราโก้ มังกรพีชคณิต', nameEn: 'Draco Algebra Dragon', descriptionTh: 'มังกรในตำนานผู้พิทักษ์ปราสาทแห่งสมการ', descriptionEn: 'Legendary dragon guardian of the Algebra Castle', rarity: 'LEGENDARY', priceCoins: 1200, requiredLevel: 5, previewConfig: { primary: '#F59E0B', secondary: '#EF4444', emoji: '🐉' } },

    { id: 'outfit_starter', itemType: 'OUTFIT', nameTh: 'ชุดนักผจญภัยเริ่มต้น', nameEn: 'Starter Adventurer Tunic', descriptionTh: 'ชุดมาตรฐานสำหรับนักสำรวจ MathQuest', descriptionEn: 'Standard issue tunic for MathQuest explorers', rarity: 'COMMON', priceCoins: 0, requiredLevel: 1, previewConfig: { badgeColor: '#3B82F6', pattern: 'solid' } },
    { id: 'outfit_neon', itemType: 'OUTFIT', nameTh: 'ชุดไซเบอร์นีออน', nameEn: 'Cyber Neon Armor', descriptionTh: 'เกราะเรืองแสงสไตล์เกมเมอร์ยุคใหม่', descriptionEn: 'Glowing cybernetic armor for speedrunners', rarity: 'RARE', priceCoins: 250, requiredLevel: 2, previewConfig: { badgeColor: '#10B981', pattern: 'neon' } },
    { id: 'outfit_royal', itemType: 'OUTFIT', nameTh: 'ชุดคลุมราชวงศ์ทองคำ', nameEn: 'Royal Golden Cloak', descriptionTh: 'ชุดคลุมสุดหรูสำหรับแชมเปี้ยนแห่งอาณาจักร', descriptionEn: 'Prestigious golden cloak for kingdom champions', rarity: 'EPIC', priceCoins: 550, requiredLevel: 4, previewConfig: { badgeColor: '#F59E0B', pattern: 'royal' } },
    { id: 'outfit_galaxy', itemType: 'OUTFIT', nameTh: 'ชุดเกราะกาแล็กซี', nameEn: 'Galaxy Cosmic Suit', descriptionTh: 'ชุดพลังจักรวาลที่เปล่งประกายดุจดวงดาว', descriptionEn: 'Cosmic suit shimmering with stardust', rarity: 'LEGENDARY', priceCoins: 950, requiredLevel: 6, previewConfig: { badgeColor: '#8B5CF6', pattern: 'galaxy' } },

    { id: 'acc_glasses', itemType: 'ACCESSORY', nameTh: 'แว่นตานักคำนวณ', nameEn: 'Smart Holo-Glasses', descriptionTh: 'แว่นตาวิเคราะห์สมการสุดเท่', descriptionEn: 'Sleek holographic calculation glasses', rarity: 'COMMON', priceCoins: 150, requiredLevel: 1, previewConfig: { icon: '🕶️' } },
    { id: 'acc_headset', itemType: 'ACCESSORY', nameTh: 'หูฟังเกมเมอร์โปร', nameEn: 'Pro Gamer Headset', descriptionTh: 'หูฟังสุดคูลพร้อมลุยโหมดแบทเทิล 1v1', descriptionEn: 'Pro esports headset for 1v1 Math Battles', rarity: 'RARE', priceCoins: 280, requiredLevel: 2, previewConfig: { icon: '🎧' } },
    { id: 'acc_crown', itemType: 'ACCESSORY', nameTh: 'มงกุฎแห่งปัญญา', nameEn: 'Crown of Wisdom', descriptionTh: 'มงกุฎทองคำสำหรับผู้พิชิตกระดานผู้นำ', descriptionEn: 'Golden crown worn by leaderboard legends', rarity: 'EPIC', priceCoins: 500, requiredLevel: 3, previewConfig: { icon: '👑' } },
    { id: 'acc_wings', itemType: 'ACCESSORY', nameTh: 'ปีกแสงแห่งชัยชนะ', nameEn: 'Wings of Victory', descriptionTh: 'ปีกพลังงานแสงสำหรับผู้เล่นระดับตำนาน', descriptionEn: 'Radiant wings of pure mathematical mastery', rarity: 'LEGENDARY', priceCoins: 900, requiredLevel: 5, previewConfig: { icon: '🪽' } },
  ];

  for (const item of shopItems) {
    await prisma.shopItem.upsert({ where: { id: item.id }, update: item, create: item });
  }

  // 5. Missions
  const missions = [
    { id: 'daily_play_3', missionType: 'DAILY', titleTh: 'เล่นเกมครบ 3 รอบ', titleEn: 'Complete 3 Games', descriptionTh: 'เล่นโหมดใดก็ได้ให้จบครบ 3 เกมในวันนี้', descriptionEn: 'Finish any 3 games today', metricKey: 'GAMES_PLAYED', targetValue: 3, rewardXp: 120, rewardCoins: 60 },
    { id: 'daily_correct_10', missionType: 'DAILY', titleTh: 'ตอบถูก 10 ข้อ', titleEn: 'Answer 10 Correctly', descriptionTh: 'ตอบคำถามคณิตศาสตร์ให้ถูกต้องสะสม 10 ข้อ', descriptionEn: 'Answer 10 math questions correctly today', metricKey: 'CORRECT_ANSWERS', targetValue: 10, rewardXp: 100, rewardCoins: 50 },
    { id: 'daily_xp_200', missionType: 'DAILY', titleTh: 'สะสม 200 XP', titleEn: 'Earn 200 XP', descriptionTh: 'รับค่าประสบการณ์สะสมครบ 200 XP ในวันนี้', descriptionEn: 'Earn 200 total XP today', metricKey: 'XP_EARNED', targetValue: 200, rewardXp: 150, rewardCoins: 80 },
    { id: 'daily_speed_1', missionType: 'DAILY', titleTh: 'พิชิต Math Speed 1 รอบ', titleEn: 'Complete 1 Math Speed', descriptionTh: 'เล่นโหมด Math Speed ให้จบอย่างน้อย 1 รอบ', descriptionEn: 'Complete at least 1 Math Speed session', metricKey: 'SPEED_COMPLETED', targetValue: 1, rewardXp: 130, rewardCoins: 70 },
    { id: 'weekly_play_20', missionType: 'WEEKLY', titleTh: 'นักสู้ประจำสัปดาห์', titleEn: 'Play 20 Games', descriptionTh: 'เล่นเกมครบ 20 รอบภายในสัปดาห์นี้', descriptionEn: 'Complete 20 games this week', metricKey: 'GAMES_PLAYED', targetValue: 20, rewardXp: 500, rewardCoins: 300 },
    { id: 'weekly_correct_100', missionType: 'WEEKLY', titleTh: 'เจ้าแห่งคำตอบ', titleEn: 'Answer 100 Correctly', descriptionTh: 'ตอบถูกสะสม 100 ข้อภายในสัปดาห์นี้', descriptionEn: 'Answer 100 questions correctly this week', metricKey: 'CORRECT_ANSWERS', targetValue: 100, rewardXp: 600, rewardCoins: 350 },
    { id: 'weekly_battle_5', missionType: 'WEEKLY', titleTh: 'แชมป์แบทเทิล', titleEn: 'Win 5 Multiplayer Matches', descriptionTh: 'ชนะในโหมด Math Battle ครบ 5 ครั้ง', descriptionEn: 'Win 5 1v1 Math Battle matches this week', metricKey: 'BATTLE_WINS', targetValue: 5, rewardXp: 750, rewardCoins: 450 },
  ];

  for (const m of missions) {
    await prisma.mission.upsert({ where: { id: m.id }, update: m, create: m });
  }

  // 6. Achievements
  const achievements = [
    { id: 'ach_first_victory', titleTh: 'ชัยชนะครั้งแรก', titleEn: 'First Victory', descriptionTh: 'เล่นเกมชนะครั้งแรกใน MathQuest', descriptionEn: 'Win your very first game in MathQuest', icon: 'Trophy', metricKey: 'GAMES_PLAYED', targetValue: 1, rewardXp: 100, rewardCoins: 75, rarity: 'COMMON' },
    { id: 'ach_math_beginner', titleTh: 'มือใหม่สายคำนวณ', titleEn: 'Math Beginner', descriptionTh: 'ตอบคำถามถูกต้องสะสมครบ 25 ข้อ', descriptionEn: 'Answer 25 math questions correctly', icon: 'Sparkles', metricKey: 'CORRECT_ANSWERS', targetValue: 25, rewardXp: 150, rewardCoins: 100, rarity: 'COMMON' },
    { id: 'ach_speed_master', titleTh: 'เจ้าแห่งความเร็ว', titleEn: 'Speed Master', descriptionTh: 'ทำคะแนนเกิน 1,000 ในโหมด Math Speed', descriptionEn: 'Score over 1,000 points in Math Speed', icon: 'Zap', metricKey: 'SPEED_HIGH_SCORE', targetValue: 1000, rewardXp: 300, rewardCoins: 200, rarity: 'RARE' },
    { id: 'ach_perfect_score', titleTh: 'สมบูรณ์แบบ 100%', titleEn: 'Perfect Score', descriptionTh: 'ตอบถูกทุกข้อในหนึ่งเกมโดยไม่ผิดเลย', descriptionEn: 'Achieve 100% accuracy in a full game', icon: 'Star', metricKey: 'PERFECT_GAMES', targetValue: 1, rewardXp: 250, rewardCoins: 180, rarity: 'RARE' },
    { id: 'ach_combo_master', titleTh: 'คอมโบมาสเตอร์', titleEn: 'Combo Master', descriptionTh: 'ทำคอมโบตอบถูกต่อเนื่องครบ 10 ข้อ', descriptionEn: 'Reach a 10x answer combo streak', icon: 'Flame', metricKey: 'BEST_COMBO', targetValue: 10, rewardXp: 350, rewardCoins: 250, rarity: 'EPIC' },
    { id: 'ach_math_explorer', titleTh: 'นักสำรวจอาณาจักร', titleEn: 'Math Explorer', descriptionTh: 'ผ่านด่านในโหมดผจญภัยครบ 5 ด่าน', descriptionEn: 'Complete 5 stages in Math Adventure', icon: 'Map', metricKey: 'STAGES_CLEARED', targetValue: 5, rewardXp: 400, rewardCoins: 300, rarity: 'EPIC' },
    { id: 'ach_daily_streak', titleTh: 'แชมป์ต่อเนื่อง 7 วัน', titleEn: 'Daily Streak Champion', descriptionTh: 'เข้าสู่ระบบต่อเนื่องครบ 7 วัน', descriptionEn: 'Maintain a 7-day login streak', icon: 'Calendar', metricKey: 'DAILY_STREAK', targetValue: 7, rewardXp: 500, rewardCoins: 400, rarity: 'LEGENDARY' },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { id: a.id }, update: a, create: a });
  }

  // 7. Level Progression Configs
  const levels = [
    { level: 1, xpRequired: 0n, coinReward: 0, unlockNoteTh: 'ปลดล็อกอาณาจักรที่ 1', unlockNoteEn: 'Unlocked World 1' },
    { level: 2, xpRequired: 200n, coinReward: 60, unlockNoteTh: 'ปลดล็อกอาณาจักรที่ 2 และชุดไซเบอร์นีออน', unlockNoteEn: 'Unlocked World 2 & Cyber Neon Armor' },
    { level: 3, xpRequired: 500n, coinReward: 100, unlockNoteTh: 'ปลดล็อกอาณาจักรที่ 3 และลูน่า จอมเวทย์ดวงดาว', unlockNoteEn: 'Unlocked World 3 & Luna Star Mage' },
    { level: 4, xpRequired: 900n, coinReward: 120, unlockNoteTh: 'ปลดล็อกชุดคลุมราชวงศ์ทองคำ', unlockNoteEn: 'Unlocked Royal Golden Cloak' },
    { level: 5, xpRequired: 1400n, coinReward: 180, unlockNoteTh: 'ปลดล็อกอาณาจักรที่ 4 และมังกรพีชคณิต', unlockNoteEn: 'Unlocked World 4 & Draco Dragon' },
    { level: 6, xpRequired: 2000n, coinReward: 200, unlockNoteTh: 'ปลดล็อกชุดเกราะกาแล็กซี', unlockNoteEn: 'Unlocked Galaxy Cosmic Suit' },
    { level: 7, xpRequired: 2700n, coinReward: 250, unlockNoteTh: 'ปลดล็อกอาณาจักรที่ 5: อาณาจักรเรขาคณิต', unlockNoteEn: 'Unlocked World 5: Geometry Kingdom' },
    { level: 8, xpRequired: 3500n, coinReward: 280, unlockNoteTh: 'ฉายา: นักปราชญ์คณิตศาสตร์', unlockNoteEn: 'Title: Math Sage' },
    { level: 9, xpRequired: 4400n, coinReward: 320, unlockNoteTh: 'โบนัสเหรียญ +10%', unlockNoteEn: 'Bonus Coins +10%' },
    { level: 10, xpRequired: 5500n, coinReward: 500, unlockNoteTh: 'ฉายาระดับตำนาน: Grandmaster', unlockNoteEn: 'Legendary Title: Grandmaster' },
  ];

  for (const lv of levels) {
    await prisma.levelConfig.upsert({ where: { level: lv.level }, update: lv, create: lv });
  }

  // 8. Sample Questions (if empty)
  const existingCount = await prisma.question.count();
  if (existingCount === 0) {
    await prisma.question.createMany({
      data: [
        {
          categoryId: 'arithmetic', difficulty: 'EASY', questionType: 'MULTIPLE_CHOICE',
          promptTh: 'ผลลัพธ์ของ 47 + 38 เท่ากับเท่าใด?', promptEn: 'What is 47 + 38?',
          optionsJson: [{ id: 'a', textTh: '75', textEn: '75' }, { id: 'b', textTh: '85', textEn: '85' }, { id: 'c', textTh: '83', textEn: '83' }, { id: 'd', textTh: '95', textEn: '95' }],
          correctOptionId: 'b', explanationTh: '40 + 30 = 70 และ 7 + 8 = 15 รวมกันเป็น 85', explanationEn: '40 + 30 = 70 and 7 + 8 = 15, so 85.', points: 100, timeLimitSeconds: 20,
        },
        {
          categoryId: 'fractions', difficulty: 'MEDIUM', questionType: 'MULTIPLE_CHOICE',
          promptTh: 'ผลลัพธ์ของ 2/3 + 1/6 ในรูปเศษส่วนอย่างต่ำคือข้อใด?', promptEn: 'What is 2/3 + 1/6 in simplest form?',
          optionsJson: [{ id: 'a', textTh: '3/9', textEn: '3/9' }, { id: 'b', textTh: '5/6', textEn: '5/6' }, { id: 'c', textTh: '4/6', textEn: '4/6' }, { id: 'd', textTh: '1', textEn: '1' }],
          correctOptionId: 'b', explanationTh: 'แปลง 2/3 เป็น 4/6 แล้วบวกกับ 1/6 จะได้ 5/6', explanationEn: 'Convert 2/3 to 4/6, then 4/6 + 1/6 = 5/6.', points: 150, timeLimitSeconds: 25,
        },
        {
          categoryId: 'algebra', difficulty: 'MEDIUM', questionType: 'MULTIPLE_CHOICE',
          promptTh: 'จงหาค่า x จากสมการ 3x − 7 = 20', promptEn: 'Solve for x: 3x − 7 = 20',
          optionsJson: [{ id: 'a', textTh: '7', textEn: '7' }, { id: 'b', textTh: '8', textEn: '8' }, { id: 'c', textTh: '9', textEn: '9' }, { id: 'd', textTh: '11', textEn: '11' }],
          correctOptionId: 'c', explanationTh: 'บวก 7 ทั้งสองข้างได้ 3x = 27 หารด้วย 3 จะได้ x = 9', explanationEn: 'Add 7 to both sides: 3x = 27. Divide by 3: x = 9.', points: 150, timeLimitSeconds: 25,
        },
        {
          categoryId: 'geometry', difficulty: 'HARD', questionType: 'MULTIPLE_CHOICE',
          promptTh: 'สามเหลี่ยมมุมฉากมีด้านประกอบมุมฉากยาว 6 และ 8 หน่วย ด้านตรงข้ามมุมฉากยาวกี่หน่วย?', promptEn: 'A right triangle has legs of length 6 and 8. What is the hypotenuse?',
          optionsJson: [{ id: 'a', textTh: '10', textEn: '10' }, { id: 'b', textTh: '12', textEn: '12' }, { id: 'c', textTh: '14', textEn: '14' }, { id: 'd', textTh: '9', textEn: '9' }],
          correctOptionId: 'a', explanationTh: 'จากทฤษฎีบทพีทาโกรัส: √(6² + 8²) = √100 = 10', explanationEn: 'By Pythagoras: √(6² + 8²) = √100 = 10.', points: 200, timeLimitSeconds: 30,
        },
        {
          categoryId: 'logic', difficulty: 'EASY', questionType: 'PUZZLE_PATTERN',
          promptTh: 'ตัวเลขที่หายไปในอนุกรม 2, 6, 12, 20, ? คือเลขใด', promptEn: 'Find the missing number in: 2, 6, 12, 20, ?',
          optionsJson: [{ id: 'a', textTh: '28', textEn: '28' }, { id: 'b', textTh: '30', textEn: '30' }, { id: 'c', textTh: '32', textEn: '32' }, { id: 'd', textTh: '26', textEn: '26' }],
          correctOptionId: 'b', explanationTh: 'ผลต่างเพิ่มขึ้นทีละ 2 (+4, +6, +8, +10) ดังนั้น 20 + 10 = 30', explanationEn: 'Differences grow by 2 (+4, +6, +8, +10), so 20 + 10 = 30.', points: 120, timeLimitSeconds: 25,
        },
      ],
    });
  }

  console.log('✅ MathQuest Prisma seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
