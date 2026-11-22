
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load the correct .env file in both local and Netlify environments.
const envPaths = [
  path.resolve(__dirname, "../.env"),
  path.resolve(process.cwd(), "backend", ".env"),
];

const envFile = envPaths.find((filePath) => fs.existsSync(filePath));

if (envFile) {
  dotenv.config({ path: envFile });
}

const express = require("express");
const cors = require("cors");
const db = require("./db");
const taskRoutes = require("./routes/tasks");

const app = express();

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
    console.error("DATABASE CONNECTION ERROR:", error);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable.",
    });
  }
});

// Task routes
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((req, res) =>
  res.status(404).json({
    message: "Route not found.",
  }),
);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

// Start local server only when running directly.
if (require.main === module) {
  const port = Number(process.env.PORT || 5000);

  app.listen(port, () => {
    console.log(`TaskFlow API listening on http://localhost:${port}`);
  });
}

module.exports = app;
