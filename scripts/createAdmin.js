require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "khasan@gmail.com";

    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log("Admin already exists 🔐");
      process.exit();
    }

    // 🚨 DO NOT HASH MANUALLY
    await User.create({
      name: "Khalid Hasan",
      email: email.toLowerCase(),
      password: "1122@@",   // let pre-save hook hash it
      role: "admin",
    });

    console.log("Admin created successfully ✅");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();