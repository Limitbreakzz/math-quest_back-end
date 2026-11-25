const prisma = require('../prisma');

const CategoryModel = {
  findActive: () =>
    prisma.mathCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),

  findAll: () => prisma.mathCategory.findMany({ orderBy: { sortOrder: 'asc' } }),

  upsert: (id, data) =>
    prisma.mathCategory.upsert({
      where: { id },
      update: data,
      create: data,
    }),

  delete: (id) => prisma.mathCategory.delete({ where: { id } }),
};

module.exports = CategoryModel;
