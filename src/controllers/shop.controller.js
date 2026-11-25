const shopService = require('../services/shop.service');

exports.listItems = async (req, res) => {
  try {
    const items = await shopService.listItems();

    res.json({
      status: 'success',
      message: 'Shop items retrieved successfully',
      data: items,
    });
  } catch (error) {
    console.error('Error fetching shop items:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getInventory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const inventory = await shopService.getInventory(req.user.id);

    res.json({
      status: 'success',
      message: 'Inventory retrieved successfully',
      data: inventory,
    });
  } catch (error) {
    console.error('Error fetching user inventory:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getPurchases = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const purchases = await shopService.getPurchases(req.user.id);

    res.json({
      status: 'success',
      message: 'Purchase history retrieved successfully',
      data: purchases,
    });
  } catch (error) {
    console.error('Error fetching purchase history:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const transactions = await shopService.getTransactions(req.user.id);

    res.json({
      status: 'success',
      message: 'Coin transactions retrieved successfully',
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching coin transactions:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.purchaseItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const result = await shopService.purchaseItem(req.user.id, String(req.params.itemId));

    res.json({
      status: 'success',
      message: 'Item purchased successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error purchasing shop item:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.equipItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const profile = await shopService.equipItem(req.user.id, String(req.params.itemId));

    res.json({
      status: 'success',
      message: 'Item equipped successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Error equipping shop item:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
