import express from "express";
import { getHabitSuggestions } from "../controllers/suggestionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/habits", protect, getHabitSuggestions);

export default router;
