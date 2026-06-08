import express from "express";

import {
  createMedication,
  getMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
} from "../controllers/medicationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/", 
    protect, 
    authorize(
  "admin",
  "pharmacist"),
    createMedication);

router.get(
    "/", 
    protect, 
    authorize(
  "admin",
  "pharmacist"),
    getMedications);

router.get(
    "/:id", 
    protect, 
    authorize(
  "admin",
  "pharmacist"),
    getMedicationById);

router.put(
    "/:id", 
    protect,
    authorize(
  "admin",
  "pharmacist"), 
    updateMedication);

router.delete(
    "/:id", 
    protect,
    authorize(
  "admin",
  "pharmacist"), 
    deleteMedication);

export default router;