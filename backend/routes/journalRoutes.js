import express from "express";
import { addJournal, getJournals, deleteJournal } from "../controllers/journalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/add", protect, addJournal);
router.get("/", protect, getJournals);
router.delete("/:id", protect, deleteJournal);

export default router;
