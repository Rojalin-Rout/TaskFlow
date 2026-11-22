
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");
const taskRoutes = require("./routes/tasks");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      message: "API and database are healthy.",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable.",
    });
  }
});

// Task API routes
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);

  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

// Local development server
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export Express app for Netlify Functions
module.exports = app;
