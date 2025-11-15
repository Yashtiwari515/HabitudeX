// client/utils/emotionMapper.js
export const emotionToHabit = {
  Happy: ["Gratitude journaling", "Share positivity"],
  Sad: ["Go for a walk", "Call a friend"],
  Angry: ["Deep breathing", "Write reflections"],
  Anxious: ["Meditation", "Digital detox"],
  Tired: ["Sleep tracking", "Light exercise"],
  Neutral: ["Maintain current habits"],
};

export const getHabitsForEmotion = (emotion) => {
  return emotionToHabit[emotion] || ["Reflect on your day"];
};
