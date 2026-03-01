require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

let dbConnected = false;

const init = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

app.use(async (req, res, next) => {
  await init();
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

app.get("/", (req, res) => {
  res.send("UIU Students API Running 🚀");
});

module.exports = app;