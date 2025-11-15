// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import burnoutRoutes from "./routes/burnoutRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(
  cors({
    origin: "*", // allow all origins during development
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet()); // Basic security headers
app.use(morgan("dev")); // Logs incoming requests
app.use("/api/user", userRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/habit", habitRoutes);
app.use("/api/burnout", burnoutRoutes);
app.use("/api/suggest", suggestionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store"); // 👈 disables all caching
  next();
});

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("🚀 AI Habit Coach Backend is Running...");
});

// --- Placeholder Routes (we’ll add next) ---
// import userRoutes from "./routes/userRoutes.js";
// app.use("/api/user", userRoutes);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
