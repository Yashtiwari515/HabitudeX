import asyncHandler from "express-async-handler";
import { generateHabitSuggestions } from "../services/suggestionService.js";

// @desc Get habit suggestions based on emotion trends
// @route GET /api/suggest/habits
// @access Private
export const getHabitSuggestions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const result = await generateHabitSuggestions(userId);
  res.json(result);
});
