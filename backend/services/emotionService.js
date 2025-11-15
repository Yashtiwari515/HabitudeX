// backend/services/emotionService.js
import fetch from "node-fetch";

export const analyzeEmotion = async (text) => {
  try {
    // 🔹 Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following journal entry and return JSON only in this format:
{
  "emotion": "<emotion word>",
  "score": <number between 0 and 1>
}

Journal Entry: "${text}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("=== GEMINI RESPONSE ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("========================");

    // 🔹 Extract model text
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // 🔹 Parse JSON safely from code block (Gemini returns ```json ... ```)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    // ✅ Normalize output
    return {
      detectedEmotion: parsed.emotion || "neutral",
      sentimentScore: parsed.score ?? 0.5,
    };
  } catch (error) {
    console.error("🔥 Emotion analysis failed:", error.message);
    return { detectedEmotion: "neutral", sentimentScore: 0.5 };
  }
};
