import express from "express";

import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../controllers/medicalRecordController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/", 
  protect, 
  authorize(
  "admin",
  "doctor",
  "medical_record_officer"),
  createMedicalRecord);

router.get
("/", protect, 
  authorize(
  "admin",
  "doctor",
  "medical_record_officer"),
  getMedicalRecords);

router.get(
  "/:id", 
  protect, 
  authorize(
  "admin",
  "doctor",
  "medical_record_officer"),
  getMedicalRecordById);

router.put(
  "/:id", 
  protect,
  authorize(
  "admin",
  "doctor",
  "medical_record_officer"), 
  updateMedicalRecord);

router.delete(
  "/:id", 
  protect,
  authorize(
  "admin",
  "doctor",
  "medical_record_officer"), 
  deleteMedicalRecord);

export default router;