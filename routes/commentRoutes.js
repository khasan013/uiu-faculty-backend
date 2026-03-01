const express = require("express");
const Comment = require("../models/Comment");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add comment
router.post("/", protect, async (req, res) => {
  const { reviewId, text } = req.body;

  const comment = await Comment.create({
    reviewId,
    userId: req.user._id,
    text,
  });

  res.json(comment);
});

// Get comments by review
router.get("/:reviewId", async (req, res) => {
  const comments = await Comment.find({
    reviewId: req.params.reviewId,
  }).populate("userId", "name");

  res.json(comments);
});

module.exports = router;