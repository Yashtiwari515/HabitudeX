import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    relatedEmotion: { type: String, default: "neutral" },
    completionRate: { type: Number, default: 0 }, // 0–100%
    completedDates: [{ type: Date }], // store history
  },
  { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
