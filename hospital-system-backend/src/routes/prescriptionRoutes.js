import express from "express";

import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescriptionStatus,
  deletePrescription,
} from "../controllers/prescriptionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "doctor"),
  createPrescription
);

router.get(
  "/",
  protect,
  authorize(
    "admin",
    "doctor",
    "pharmacist"
  ),
  getPrescriptions
);

router.get(
  "/:id",
  protect,
  authorize(
    "admin",
    "doctor",
    "pharmacist"
  ),
  getPrescriptionById
);

router.put(
  "/:id/status",
  protect,
  authorize(
    "admin",
    "pharmacist"
  ),
  updatePrescriptionStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deletePrescription
);

export default router;