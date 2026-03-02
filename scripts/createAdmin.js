require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await connectDB();

    console.log("✅ Connected to DB:", mongoose.connection.name);

    const email = "khasan@gmail.com";

    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log("🔐 Admin already exists");
      console.log(adminExists);
      process.exit(0);
    }

    console.log("👤 Creating admin...");

    const hashedPassword = await bcrypt.hash("1122@@", 10);

    const admin = await User.create({
      name: "Khalid Hasan",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("🎉 Admin created successfully!");
    console.log(admin);

    process.exit(0);

  } catch (error) {
    console.error("❌ ERROR:", error);
    process.exit(1);
  }
};

createAdmin();