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
      teacherId: teacherId,          // ✅ matches model
      userId: req.user._id,          // ✅ matches model
      text,
      rating,
    });

    // 🔥 Recalculate average rating
    const reviews = await Review.find({ teacherId });

    const total = reviews.reduce((acc, item) => acc + item.rating, 0);
    const average = total / reviews.length;

    await Teacher.findByIdAndUpdate(teacherId, {
      averageRating: Number(average.toFixed(1)),
      reviewCount: reviews.length,
    });

    res.json(review);

  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);
    res.status(500).json({ message: "Server error while adding review" });
  }
});

// ================= GET REVIEWS =================
router.get("/:teacherId", async (req, res) => {
  try {
    const reviews = await Review.find({
      teacherId: req.params.teacherId,
    }).populate("userId", "name");   // ✅ matches model

    res.json(reviews);

  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

module.exports = router;