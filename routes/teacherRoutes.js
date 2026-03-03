const express = require("express");
const Teacher = require("../models/Teacher");

const router = express.Router();


// ========================================
// GET ALL TEACHERS (Public)
// ========================================
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    console.error("FETCH TEACHERS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch teachers",
      error: error.message
    });
  }
});


// ========================================
// ADD TEACHER (Single OR Bulk)
// ========================================
router.post("/", async (req, res) => {
  try {

    // ❌ If body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body cannot be empty"
      });
    }

    // 🔥 BULK INSERT (Array of teachers)
    if (Array.isArray(req.body)) {

      const teachers = await Teacher.insertMany(req.body);

      return res.status(201).json({
        message: "Teachers added successfully",
        count: teachers.length,
        data: teachers
      });
    }

    // 🔥 SINGLE INSERT (One teacher)
    const { name, department, designation } = req.body;

    if (!name || !department || !designation) {
      return res.status(400).json({
        message: "name, department and designation are required"
      });
    }

    const teacher = await Teacher.create({
      name,
      department,
      designation
    });

    res.status(201).json({
      message: "Teacher created successfully",
      data: teacher
    });

  } catch (error) {
    console.error("CREATE TEACHER ERROR:", error);
    res.status(500).json({
      message: "Failed to create teacher",
      error: error.message
    });
  }
});


module.exports = router;