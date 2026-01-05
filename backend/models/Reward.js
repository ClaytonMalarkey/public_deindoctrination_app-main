const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
});

module.exports = mongoose.model("Reward", RewardSchema);
