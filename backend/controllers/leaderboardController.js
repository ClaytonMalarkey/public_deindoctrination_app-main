const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('username points level')
      .sort({ points: -1 })
      .limit(10);
    
    const leaderboard = users.map((user, index) => ({
      id: user._id,
      rank: index + 1,
      username: user.username,
      points: user.points,
      level: user.level
    }));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};
