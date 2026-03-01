const express = require("express");
const Teacher = require("../models/Teacher");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all teachers
router.get("/", async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

// ADD teacher (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  const { name, department, designation } = req.body;

  const teacher = await Teacher.create({
    name,
    department,
    designation,
  });

  res.json(teacher);
});

module.exports = router;