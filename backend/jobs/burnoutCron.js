import cron from "node-cron";
import User from "../models/User.js";
import { computeBurnoutForUser } from "../services/burnoutService.js";

export const scheduleBurnoutJob = () => {
  // Schedule job to run every day at 00:00 (midnight)
  cron.schedule("0 0 * * *", async () => {
    console.log("🕛 Running daily burnout analysis...");

    try {
      const users = await User.find({});
      console.log(`🧠 Found ${users.length} users`);

      for (const user of users) {
        try {
          const result = await computeBurnoutForUser(user._id, {
            skipSave: false,
          });
          console.log(
            `✅ Burnout computed for ${user.email}: Score ${result.score}`
          );
        } catch (err) {
          console.error(
            `❌ Error computing burnout for ${user.email}: ${err.message}`
          );
        }
      }

      console.log("🌙 Daily burnout job completed.");
    } catch (error) {
      console.error("🔥 Burnout cron job failed:", error.message);
    }
  });
};
