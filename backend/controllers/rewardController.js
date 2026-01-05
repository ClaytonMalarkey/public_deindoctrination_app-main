const Reward = require("../models/Reward");
const User = require("../models/User");

exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rewards" });
  }
};

exports.redeemReward = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const reward = await Reward.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    if (user.points >= reward.cost) {
      user.points -= reward.cost;
      await user.save();
      res.json({ 
        message: "Reward redeemed successfully!",
        remainingPoints: user.points,
        redeemedReward: reward
      });
    } else {
      res.status(400).json({ 
        message: "Not enough points!",
        required: reward.cost,
        available: user.points
      });
    }
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ message: "Error redeeming reward" });
  }
};
