const express = require("express");
const Review = require("../models/Review");
const Teacher = require("../models/Teacher");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add review + auto update rating
router.post("/", protect, async (req, res) => {
  const { teacherId, text, rating } = req.body;

  // Create review
  const review = await Review.create({
    teacherId,
    userId: req.user._id,
    text,
    rating,
  });

  // 🔥 Recalculate average rating
  const reviews = await Review.find({ teacherId });

  const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
  const average = totalRating / reviews.length;

  // Update teacher
  await Teacher.findByIdAndUpdate(teacherId, {
    averageRating: average.toFixed(1),
    reviewCount: reviews.length,
  });

  res.json(review);
});


// Get reviews by teacher
router.get("/:teacherId", async (req, res) => {
  const reviews = await Review.find({
    teacherId: req.params.teacherId,
  }).populate("userId", "name");

  res.json(reviews);
});

module.exports = router;