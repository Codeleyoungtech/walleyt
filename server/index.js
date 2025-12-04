require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const wallpaperRoutes = require("./routes/wallpapers");
const categoryRoutes = require("./routes/categories");
const analyticsRoutes = require("./routes/analytics");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/wallpapers", wallpaperRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/analytics", analyticsRoutes);

// Serve admin panel
app.use("/admin", express.static("public/admin"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
});
