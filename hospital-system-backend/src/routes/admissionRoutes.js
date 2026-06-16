import express from "express";

import {
  admitPatient,
  getAdmissions,
  getAdmissionById,
  dischargePatient,
  deleteAdmission,
} from "../controllers/admissionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admit patient
router.post(
  "/",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "medical_record_officer"
  ),
  admitPatient
);

// Get all admissions
router.get(
  "/",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "medical_record_officer"
  ),
  getAdmissions
);

// Get single admission
router.get(
  "/:id",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "medical_record_officer"
  ),
  getAdmissionById
);

// Discharge patient
router.put(
  "/:id/discharge",
  protect,
  authorize(
    "admin",
    "doctor"
  ),
  dischargePatient
);

// Delete admission
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAdmission
);

export default router;