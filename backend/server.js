import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";
// import helmet from "helmet";

import userRoutes from "./routes/userRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import burnoutRoutes from "./routes/burnoutRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use(helmet());
// app.use(morgan("dev"));

// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store");
//   next();
// });

app.use("/api/user", userRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/habit", habitRoutes);
app.use("/api/burnout", burnoutRoutes);
app.use("/api/suggest", suggestionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("🚀 AI Habit Coach Backend is Running...");
});

export default app;
