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

dotenv.config();

// Connect DB
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("🚀 AI Habit Coach Backend is Running...");
});

app.use("/api/user", userRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/habit", habitRoutes);
app.use("/api/burnout", burnoutRoutes);
app.use("/api/suggest", suggestionRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
