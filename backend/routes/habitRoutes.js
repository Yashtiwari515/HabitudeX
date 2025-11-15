import express from "express";
import {
  addHabit,
  getHabits,
  markHabitComplete,
  deleteHabit,
  updateHabit,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addHabit).get(protect, getHabits);
router.route("/:id/complete").put(protect, markHabitComplete);
router
  .route("/:id")
  .put(protect, updateHabit) // ⬅ EDIT HABIT
  .delete(protect, deleteHabit);

export default router;
