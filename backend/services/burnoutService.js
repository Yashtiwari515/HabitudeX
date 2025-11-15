// backend/services/burnoutService.js
import Journal from "../models/Journal.js";
import Habit from "../models/Habit.js";
import { BURNOUT_LEVELS } from "../utils/constants.js";
import BurnoutHistory from "../models/BurnoutHistory.js";

/**
 * Helper: compute variance
 */
const variance = (arr) => {
  if (!arr.length) return 0;
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const varr = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length;
  return varr;
};

/**
 * Count occurrences of stress keywords in a joined text
 */
const countStressKeywords = (text, keywords) => {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let count = 0;
  for (const kw of keywords) {
    // approximate count
    const re = new RegExp(`\\b${kw}\\b`, "g");
    const m = lower.match(re);
    if (m) count += m.length;
  }
  return count;
};

/**
 * Compute burnout score for a user
 * Returns { score, breakdown: {...}, status, suggestions }
 */
export const computeBurnoutForUser = async (userId, opts = {}) => {
  // options / tunables
  const {
    daysWindow = 30,
    stressKeywords = [
      "tired",
      "exhausted",
      "burnout",
      "overwhelmed",
      "stressed",
      "anxious",
      "fatigue",
    ],
    weights = {
      volatility: 0.4,
      stressCount: 0.25,
      habitDrop: 0.2,
      negativeStreak: 0.15,
    },
  } = opts;

  // 1) fetch journals in window
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - daysWindow);

  const journals = await Journal.find({
    user: userId,
    date: { $gte: sinceDate },
  }).sort({ date: 1 });

  const sentimentScores = journals.map((j) =>
    typeof j.sentimentScore === "number" ? j.sentimentScore : 0.5
  );

  // normalized volatility: map variance -> 0..1
  const vol = variance(sentimentScores); // variance
  // approximate normalization: variance range expected 0..0.25 (since score 0..1)
  const normVol = Math.min(1, vol / 0.08); // tuning constant

  // 2) stress keyword count
  const combinedText = journals.map((j) => j.text || "").join(" ");
  const stressCount = countStressKeywords(combinedText, stressKeywords);
  // normalize stress: assume keywords per window (max useful cap 10)
  const normStress = Math.min(1, stressCount / 6);

  // 3) habit completion drop
  // compute completionRate in last 30 days vs previous 30 days (if available)
  const habits = await Habit.find({ user: userId });
  // completionRate stored per habit; we approximate using completionRate field
  // if no habits, habitDrop = 0
  let habitDropNorm = 0;
  if (habits.length > 0) {
    // simple: average completionRate across habits (0-100)
    const avgCompletion =
      habits.reduce((s, h) => s + (h.completionRate || 0), 0) / habits.length;
    // assume ideal >= 70, drop normalized = (70 - avg)/70 clipped
    const drop = Math.max(0, 70 - avgCompletion) / 70;
    habitDropNorm = Math.min(1, drop);
  }

  // 4) negative emotion streak (consecutive days where detectedEmotion is negative)
  // treat emotions as negative if in list
  const negativeSet = new Set([
    "sad",
    "angry",
    "anxious",
    "tired",
    "depressed",
    "stressed",
  ]);
  // build map of date -> predominant emotion
  const byDay = {};
  for (const j of journals) {
    const d = new Date(j.date);
    const key = d.toISOString().slice(0, 10);
    byDay[key] = byDay[key] || [];
    byDay[key].push((j.detectedEmotion || "").toLowerCase());
  }
  // compute consecutive negative days (most recent streak)
  const dayKeys = Object.keys(byDay).sort();
  let maxStreak = 0;
  let curr = 0;
  for (const k of dayKeys) {
    const emotions = byDay[k];
    const negativeCount = emotions.filter((e) => negativeSet.has(e)).length;
    if (negativeCount > 0) {
      curr += 1;
      if (curr > maxStreak) maxStreak = curr;
    } else {
      curr = 0;
    }
  }
  // take recent streak (cap at 14)
  const normStreak = Math.min(1, maxStreak / 7); // 7-day streak maps to 1

  // compute weighted score (0..1)
  const scoreNormalized =
    normVol * weights.volatility +
    normStress * weights.stressCount +
    habitDropNorm * weights.habitDrop +
    normStreak * weights.negativeStreak;

  const score = Math.round(scoreNormalized * 100);

  // status mapping
  let status = BURNOUT_LEVELS.LOW;
  if (score >= 71) status = BURNOUT_LEVELS.HIGH;
  else if (score >= 41) status = BURNOUT_LEVELS.MODERATE;

  // suggestions (simple mapping)
  const suggestions = [];
  if (normStress > 0.2)
    suggestions.push("Try a short walk and schedule a break.");
  if (normStreak > 0.3)
    suggestions.push(
      "Consider reaching out to a friend or journaling more frequently."
    );
  if (habitDropNorm > 0.2)
    suggestions.push(
      "Start with smaller habit goals (2–5 minutes) to rebuild consistency."
    );
  if (normVol > 0.3)
    suggestions.push("Practice a short breathing exercise and track sleep.");

  // ensure at least one suggestion
  if (!suggestions.length)
    suggestions.push("Keep journaling and maintain regular rest.");


  // Store new burnout record (optional parameter)
  if (!opts.skipSave) {
    await BurnoutHistory.create({
      user: userId,
      score,
      status,
    });
  }

  return {
    score,
    status,
    breakdown: {
      volatility: Math.round(normVol * 100),
      stressCount,
      habitDrop: Math.round(habitDropNorm * 100),
      negativeStreakDays: maxStreak,
    },
    suggestions,
  };
};
