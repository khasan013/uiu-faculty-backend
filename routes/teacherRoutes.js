const express = require("express");
const Teacher = require("../models/Teacher");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

// ADD teacher (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, department, designation } = req.body;

    const teacher = await Teacher.create({
      name,
      department,
      designation,
    });

    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create teacher" });
  }
});

module.exports = router;