// client/hooks/useEmotion.js
import { useState } from "react";
import { analyzeEmotion, getEmotionTrends } from "../services/emotionService";
import { useEmotion as useEmotionContext } from "../context/EmotionContext";

export default function useEmotion() {
  const [loading, setLoading] = useState(false);
  const { addEmotion, emotions, averageMood } = useEmotionContext();

  const analyzeText = async (text) => {
    setLoading(true);
    try {
      const result = await analyzeEmotion(text);
      addEmotion({
        date: new Date().toLocaleDateString(),
        emotion: result.emotion,
        score: result.score,
      });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    return await getEmotionTrends();
  };

  return { emotions, averageMood, analyzeText, fetchTrends, loading };
}
