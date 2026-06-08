import express from "express";

import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create patient
router.post(
  "/",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "receptionist",
    "medical_record_officer"
  ),
  createPatient
);

// Get all patients
router.get(
  "/",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "receptionist",
    "medical_record_officer"
  ),
  getPatients
);

// Get single patient
router.get(
  "/:id",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "receptionist",
    "medical_record_officer"
  ),
  getPatientById
);

// Update patient
router.put(
  "/:id",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "receptionist",
    "medical_record_officer"
  ),
  updatePatient
);

// Delete patient
router.delete(
  "/:id",
  protect,
  authorize(
    "admin",
    "doctor",
    "nurse",
    "receptionist",
    "medical_record_officer"
  ),
  deletePatient
);

export default router;