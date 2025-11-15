import asyncHandler from "express-async-handler";
import { computeBurnoutForUser } from "../services/burnoutService.js";
import BurnoutHistory from "../models/BurnoutHistory.js";

// @desc Get burnout risk for authenticated user (realtime)
// @route GET /api/burnout
export const getBurnout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const result = await computeBurnoutForUser(userId);
  res.json(result);
});

// @desc Get burnout timeline (weekly or daily)
// @route GET /api/burnout/timeline
export const getBurnoutTimeline = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // get last 8 weeks
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 56);

  const history = await BurnoutHistory.find({
    user: userId,
    createdAt: { $gte: sinceDate },
  }).sort({ createdAt: 1 });

  // Group weekly (optional)
  const grouped = {};
  for (const h of history) {
    const week = new Date(h.date);
    const year = week.getFullYear();
    const weekNum = Math.ceil(
      ((week - new Date(year, 0, 1)) / 86400000 +
        new Date(year, 0, 1).getDay() +
        1) /
        7
    );
    const key = `${year}-W${weekNum}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h.score);
  }

  const weeklyTimeline = Object.entries(grouped).map(([week, scores]) => ({
    week,
    avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));

  res.json({
    count: weeklyTimeline.length,
    timeline: weeklyTimeline,
  });
});
