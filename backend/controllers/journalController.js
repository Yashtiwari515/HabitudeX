import asyncHandler from "express-async-handler";
import Journal from "../models/Journal.js";
import { analyzeEmotion } from "../services/emotionService.js";

// @desc    Add a new journal entry
// @route   POST /api/journal/add
// @access  Private
export const addJournal = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    res.status(400);
    throw new Error("Journal text is required");
  }

  try {
    // 🔹 Analyze emotion using Gemini (or fallback)
    const emotionResult = await analyzeEmotion(text);

    console.log("AI Response:", emotionResult);

    // 🔹 Save journal to DB
    const journal = await Journal.create({
      user: req.user._id,
      text,
      detectedEmotion: emotionResult.detectedEmotion || "neutral",
      sentimentScore: emotionResult.sentimentScore ?? 0.5,
      date: new Date(),
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error("Error saving journal:", error.message);
    res.status(500).json({ message: "Failed to save journal entry" });
  }
});

// @desc    Get all journals for the logged-in user
// @route   GET /api/journal
// @access  Private
export const getJournals = asyncHandler(async (req, res) => {
  const journals = await Journal.find({ user: req.user._id }).sort({
    date: -1,
  });

  if (!journals || journals.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(journals);
});

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
// @access  Private
export const deleteJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    res.status(404);
    throw new Error("Journal not found");
  }

  if (journal.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this journal");
  }

  await journal.deleteOne();
  res.json({ message: "Journal deleted successfully" });
});
