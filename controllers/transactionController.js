const User = require('../models/User');
const Shop = require('../models/Shop');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// Earn Points
exports.earnPoints = async (req, res) => {
  try {
    const { phone, shopId, amount } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    let wallet = await Wallet.findOne({ shop: shop._id, user: user._id });

    if (!wallet) {
      wallet = await Wallet.create({
        shop: shop._id,
        user: user._id,
        points: 0
      });
    }

    // ₹10 spent → 1 point
    const pointsEarned = Math.floor(amount / shop.rewardRate);

    wallet.points += pointsEarned;
    await wallet.save();

    await Transaction.create({
      shop: shop._id,
      user: user._id,
      amount,
      points: pointsEarned,
      type: 'earn'
    });

    res.json({
      message: "Points earned successfully",
      pointsEarned,
      totalPoints: wallet.points
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Redeem Points
exports.redeemPoints = async (req, res) => {
  try {
    const { phone, shopId, points } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wallet = await Wallet.findOne({
      user: user._id,
      shop: shopId
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.points < points) {
      return res.status(400).json({ message: "Not enough points" });
    }

    wallet.points -= points;
    await wallet.save();

    const discount = points; // 1 point = ₹1

    await Transaction.create({
      shop: shopId,
      user: user._id,
      amount: 0,
      points,
      type: 'redeem'
    });

    res.json({
      message: "Points redeemed successfully",
      discount,
      remainingPoints: wallet.points
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};