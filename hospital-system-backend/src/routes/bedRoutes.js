import express from "express";
import {
  getBeds,
  getAvailableBeds,
  getBedStatistics,
} from "../controllers/bedController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBeds);
router.get("/available", protect, getAvailableBeds);

router.get(
  "/stats",
  protect,
  getBedStatistics
);

export default router;