// client/services/emotionService.js
import API from "./api";

export const getEmotionTrends = async () => {
  const { data } = await API.get("/emotion/trends");
  return data; // e.g. [{ date, avgScore }]
};

export const analyzeEmotion = async (text) => {
  const { data } = await API.post("/emotion/analyze", { text });
  return data; // e.g. { emotion: "Anxious", score: 0.76 }
};

export const getBurnoutRisk = async () => {
  const res = await API.get("/burnout", {
    headers: { "Cache-Control": "no-cache" }, // 👈 add this line
  });
  return res.data;
};
