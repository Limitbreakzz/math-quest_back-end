const prisma = require('../prisma');

const QuestionModel = {
  findFiltered: ({ categoryId, difficulty, puzzleOnly }) => {
    const where = { isActive: true };
    if (puzzleOnly) {
      where.OR = [{ questionType: { startsWith: 'PUZZLE' } }, { categoryId: 'logic' }];
    } else {
      if (categoryId && categoryId !== 'all') where.categoryId = categoryId;
      if (difficulty && difficulty !== 'ALL') where.difficulty = difficulty;
    }
    return prisma.question.findMany({ where });
  },

  findAll: () => prisma.question.findMany({ orderBy: { createdAt: 'desc' } }),

  findById: (id) => prisma.question.findUnique({ where: { id } }),

  create: (data) => prisma.question.create({ data }),

  update: (id, data) => prisma.question.update({ where: { id }, data }),

  delete: (id) => prisma.question.delete({ where: { id } }),

  count: () => prisma.question.count(),
};

module.exports = QuestionModel;
