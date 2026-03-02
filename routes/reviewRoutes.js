const express = require("express");
const Review = require("../models/Review");
const Teacher = require("../models/Teacher");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ================= ADD REVIEW =================
router.post("/", protect, async (req, res) => {
  try {
    const { teacherId, text, rating } = req.body;

    const review = await Review.create({
      teacher: teacherId,      // ✅ match model field
      user: req.user._id,      // ✅ match model field
      text,
      rating,
    });

    // Recalculate average rating
    const reviews = await Review.find({ teacher: teacherId });

    const totalRating = reviews.reduce(
      (acc, item) => acc + item.rating,
      0
    );

    const average = totalRating / reviews.length;

    await Teacher.findByIdAndUpdate(teacherId, {
      averageRating: Number(average.toFixed(1)),
      reviewCount: reviews.length,
    });

    res.json(review);

  } catch (error) {
    res.status(500).json({ message: "Failed to add review" });
  }
});

// ================= GET REVIEWS =================
router.get("/:teacherId", async (req, res) => {
  try {
    const reviews = await Review.find({
      teacher: req.params.teacherId,   // ✅ match model
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

module.exports = router;