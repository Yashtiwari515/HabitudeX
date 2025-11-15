import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    detectedEmotion: { type: String },
    sentimentScore: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", journalSchema);
export default Journal;
