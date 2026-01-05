const express = require("express");
const { getRewards, redeemReward } = require("../controllers/rewardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getRewards);
router.post("/redeem/:id", authMiddleware, redeemReward);

module.exports = router;
