import asyncHandler from "express-async-handler";
import Habit from "../models/Habit.js";

// @desc   Add new habit
// @route  POST /api/habit
// @access Private
export const addHabit = asyncHandler(async (req, res) => {
  const { title, frequency, relatedEmotion } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Habit title is required");
  }

  const habit = await Habit.create({
    user: req.user._id,
    title,
    frequency: frequency || "daily",
    relatedEmotion: relatedEmotion || "neutral",
  });

  res.status(201).json(habit);
});

// @desc   Get all habits for a user
// @route  GET /api/habit
// @access Private
export const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(habits);
});

// @desc   Mark habit as completed for today
// @route  PUT /api/habit/:id/complete
// @access Private
export const markHabitComplete = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  const today = new Date().toDateString();
  const alreadyDone = habit.completedDates.some(
    (date) => new Date(date).toDateString() === today
  );

  if (!alreadyDone) {
    habit.completedDates.push(new Date());
    habit.completionRate = (habit.completedDates.length / 30) * 100; // simplistic monthly rate
    await habit.save();
  }

  res.json(habit);
});

// @desc   Delete a habit
// @route  DELETE /api/habit/:id
// @access Private
export const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  await habit.deleteOne();
  res.json({ message: "Habit deleted successfully" });
});

// @desc   Update habit (edit)
// @route  PUT /api/habit/:id
// @access Private
export const updateHabit = asyncHandler(async (req, res) => {
  const { title, frequency, relatedEmotion } = req.body;

  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  // Update allowed fields
  if (title !== undefined) habit.title = title;
  if (frequency !== undefined) habit.frequency = frequency;
  if (relatedEmotion !== undefined) habit.relatedEmotion = relatedEmotion;

  const updated = await habit.save();
  res.json(updated);
});
