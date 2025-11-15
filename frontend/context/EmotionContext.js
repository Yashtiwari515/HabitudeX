// client/context/EmotionContext.js
import React, { createContext, useState, useContext } from "react";

const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [emotions, setEmotions] = useState([]); // [{ date, emotion, score }]
  const [averageMood, setAverageMood] = useState(0);

  const addEmotion = (newEmotion) => {
    const updated = [...emotions, newEmotion];
    setEmotions(updated);

    const avg =
      updated.reduce((sum, e) => sum + (e.score || 0), 0) / updated.length;
    setAverageMood(parseFloat(avg.toFixed(2)));
  };

  const clearEmotions = () => {
    setEmotions([]);
    setAverageMood(0);
  };

  return (
    <EmotionContext.Provider
      value={{ emotions, averageMood, addEmotion, clearEmotions }}
    >
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmotion = () => useContext(EmotionContext);
