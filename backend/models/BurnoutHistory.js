import mongoose from "mongoose";

const burnoutHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: { type: Number, required: true },
    status: { type: String, enum: ["Low", "Moderate", "High"], required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BurnoutHistory = mongoose.model("BurnoutHistory", burnoutHistorySchema);
export default BurnoutHistory;
