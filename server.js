require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

require("./models/User");
require("./models/Teacher");
require("./models/Review");
require("./models/Comment");

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

app.get("/", (req, res) => {
  res.send("UIU Students API Running 🚀");
});

// 🚨 REMOVE app.listen()
// Export instead
module.exports = app;