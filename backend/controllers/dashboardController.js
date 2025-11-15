import asyncHandler from "express-async-handler";
import Journal from "../models/Journal.js";
import Habit from "../models/Habit.js";
import BurnoutHistory from "../models/BurnoutHistory.js";
import { generateHabitSuggestions } from "../services/suggestionService.js";

/**
 * @desc Get all dashboard analytics for the logged-in user
 * @route GET /api/dashboard
 * @access Private
 */
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 🧠 1. Emotion Trends (last 14 days)
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 14);
  const journals = await Journal.find({
    user: userId,
    date: { $gte: sinceDate },
  }).sort({ date: 1 });

  const emotionTrend = journals.map((j) => ({
    date: j.date,
    emotion: j.detectedEmotion,
    sentiment: j.sentimentScore,
  }));

  // 🕒 2. Habit Consistency
  const habits = await Habit.find({ user: userId });
  const totalHabits = habits.length;
  const avgCompletion = totalHabits
    ? Math.round(
        habits.reduce((sum, h) => sum + (h.completionRate || 0), 0) /
          totalHabits
      )
    : 0;

  const topHabits = habits
    .sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0))
    .slice(0, 3)
    .map((h) => ({
      title: h.title,
      completionRate: Math.round(h.completionRate),
      relatedEmotion: h.relatedEmotion,
    }));

  // 🔥 3. Burnout Timeline (last 6 entries)
  const burnout = await BurnoutHistory.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(6)
    .select("score status createdAt");

  const burnoutTrend = burnout.reverse().map((b) => ({
    date: b.createdAt,
    score: b.score,
    status: b.status,
  }));

  // 💡 4. Suggested Habits (based on emotion trends)
  const suggestions = await generateHabitSuggestions(userId);

  // ✅ Final Combined Response
  res.json({
    user: req.user.name,
    analytics: {
      emotionTrend,
      avgHabitCompletion: avgCompletion,
      topHabits,
      burnoutTrend,
      suggestions,
    },
  });
});
