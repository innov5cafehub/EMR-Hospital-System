import express from "express";
import { getOverviewAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/overview",
  protect,
  authorize("admin"),
  getOverviewAnalytics
);

export default router;