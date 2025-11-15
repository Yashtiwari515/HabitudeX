import Journal from "../models/Journal.js";
import Habit from "../models/Habit.js";

const EMOTION_TO_HABITS = {
  happy: ["Gratitude journaling", "Share positivity", "Creative writing"],
  sad: ["Go for a walk", "Call a friend", "Listen to uplifting music"],
  anxious: ["Meditation", "Breathing exercises", "Digital detox"],
  angry: ["Write reflections", "Do light exercise", "Take a break outdoors"],
  tired: ["Sleep tracking", "Stretching routine", "Hydration reminder"],
  neutral: ["Maintain current habits", "Try a new hobby"],
  stressed: ["Mindfulness", "Short breaks", "Relaxing playlist"],
};

/**
 * Analyze user's emotion trends and return recommended habits.
 * @param {string} userId
 * @returns {object} { topEmotion, suggestions }
 */
export const generateHabitSuggestions = async (userId) => {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 7);

  // Get journals from the past week
  const journals = await Journal.find({
    user: userId,
    date: { $gte: sinceDate },
  });

  if (!journals.length) {
    return {
      message:
        "No recent journals found. Keep journaling to get personalized habits!",
    };
  }

  // Count emotion occurrences
  const emotionCounts = {};
  journals.forEach((j) => {
    const emotion = (j.detectedEmotion || "neutral").toLowerCase();
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });

  // Identify the most frequent emotion
  const topEmotion = Object.keys(emotionCounts).reduce((a, b) =>
    emotionCounts[a] > emotionCounts[b] ? a : b
  );

  // Existing habits (to avoid suggesting duplicates)
  const existingHabits = await Habit.find({ user: userId });
  const existingTitles = existingHabits.map((h) => h.title.toLowerCase());

  // Suggested habits
  const allSuggestions =
    EMOTION_TO_HABITS[topEmotion] || EMOTION_TO_HABITS["neutral"];
  const filtered = allSuggestions.filter(
    (h) => !existingTitles.includes(h.toLowerCase())
  );

  return {
    topEmotion,
    suggestedHabits: filtered.length ? filtered : ["Keep up your good habits!"],
    emotionSummary: emotionCounts,
  };
};
