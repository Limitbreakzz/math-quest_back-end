const prisma = require('../prisma');

const ShopModel = {
  findAvailableItems: () =>
    prisma.shopItem.findMany({
      where: { isAvailable: true },
      orderBy: [{ itemType: 'asc' }, { priceCoins: 'asc' }],
    }),

  findItemById: (id) => prisma.shopItem.findUnique({ where: { id } }),

  findInventory: (userId) =>
    prisma.playerInventory.findMany({
      where: { userId },
      include: { item: true },
    }),

  hasItem: (userId, itemId) =>
    prisma.playerInventory.findUnique({
      where: { userId_itemId: { userId, itemId } },
    }),

  findPurchases: (userId) =>
    prisma.purchaseHistory.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { purchasedAt: 'desc' },
    }),

  findTransactions: (userId, limit = 50) =>
    prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),

  upsertItem: (id, data) =>
    prisma.shopItem.upsert({
      where: { id },
      update: data,
      create: data,
    }),

  deleteItem: (id) => prisma.shopItem.delete({ where: { id } }),
};

module.exports = ShopModel;
