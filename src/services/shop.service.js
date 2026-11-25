const prisma = require('../prisma');
const ShopModel = require('../models/shop.model');
const ERROR_CODES = require('../constants/errorCodes');
const { AppError } = require('../middlewares/error.middleware');

exports.listItems = () => ShopModel.findAvailableItems();

exports.getInventory = (userId) => ShopModel.findInventory(userId);

exports.getPurchases = (userId) => ShopModel.findPurchases(userId);

exports.getTransactions = (userId) => ShopModel.findTransactions(userId);

exports.purchaseItem = async (userId, itemId) => {
  return prisma.$transaction(async (tx) => {
    const [profile, item, alreadyOwned] = await Promise.all([
      tx.profile.findUnique({ where: { id: userId } }),
      tx.shopItem.findUnique({ where: { id: itemId } }),
      tx.playerInventory.findUnique({ where: { userId_itemId: { userId, itemId } } }),
    ]);

    if (!profile) throw new AppError(ERROR_CODES.PROFILE_NOT_FOUND);
    if (!item || !item.isAvailable) throw new AppError(ERROR_CODES.SHOP_ITEM_NOT_FOUND);
    if (alreadyOwned) throw new AppError(ERROR_CODES.SHOP_ITEM_ALREADY_OWNED);
    if (profile.level < item.requiredLevel) {
      throw new AppError(ERROR_CODES.SHOP_LEVEL_REQUIRED, 400, ERROR_CODES.SHOP_LEVEL_REQUIRED.code, {
        requiredLevel: item.requiredLevel,
      });
    }
    if (profile.coins < BigInt(item.priceCoins)) {
      throw new AppError(ERROR_CODES.SHOP_INSUFFICIENT_COINS);
    }

    const newBalance = profile.coins - BigInt(item.priceCoins);

    await tx.profile.update({
      where: { id: userId },
      data: { coins: newBalance },
    });

    await tx.playerInventory.create({ data: { userId, itemId } });

    const purchase = await tx.purchaseHistory.create({
      data: { userId, itemId, pricePaid: item.priceCoins },
    });

    await tx.coinTransaction.create({
      data: {
        userId,
        amount: -item.priceCoins,
        balanceAfter: newBalance,
        transactionType: 'SHOP_PURCHASE',
        referenceId: itemId,
        description: `Purchased ${item.nameEn}`,
      },
    });

    return { purchase, balanceAfter: newBalance, itemId };
  });
};

exports.equipItem = async (userId, itemId) => {
  const item = await ShopModel.findItemById(itemId);
  if (!item) throw new AppError(ERROR_CODES.SHOP_ITEM_NOT_FOUND);

  if (item.priceCoins > 0) {
    const owned = await ShopModel.hasItem(userId, itemId);
    if (!owned) throw new AppError(ERROR_CODES.SHOP_ITEM_NOT_OWNED);
  }

  const updateData =
    item.itemType === 'CHARACTER'
      ? { equippedCharacterId: itemId }
      : item.itemType === 'OUTFIT'
      ? { equippedOutfitId: itemId }
      : { equippedAccessoryId: itemId };

  return prisma.profile.update({ where: { id: userId }, data: updateData });
};
