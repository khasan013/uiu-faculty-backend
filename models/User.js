const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

// ===== AUTO CREATE DEFAULT ADMIN =====
const createDefaultAdmin = async () => {
  const adminExists = await User.findOne({ email: "khasan" });

  if (!adminExists) {
    await User.create({
      name: "Khalid Hasan",
      email: "khasan",
      password: "1122@",
      role: "admin",
    });
    console.log("Default Admin Created ✅");
  } else {
    console.log("Admin Already Exists 🔐");
  }
};

createDefaultAdmin();

module.exports = User;