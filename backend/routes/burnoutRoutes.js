import express from "express";
import {
  getBurnout,
  getBurnoutTimeline,
} from "../controllers/burnoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBurnout);
router.get("/timeline", protect, getBurnoutTimeline);

export default router;
