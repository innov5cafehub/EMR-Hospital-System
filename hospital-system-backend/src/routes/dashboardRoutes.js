import express from "express";
import { getPatientDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/patients/:id/dashboard",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "medical_record_officer"
  ),
  getPatientDashboard
);

export default router;