import express from "express";

import {
  createLabReport,
  getLabReports,
  getLabReportById,
  updateLabReport,
  deleteLabReport,
} from "../controllers/labReportController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/", 
    protect,
    authorize(
  "admin",
  "doctor",
  "lab_scientist"), 
    createLabReport);

router.get(
    "/", 
    protect,
    authorize(
  "admin",
  "doctor",
  "lab_scientist"), 
    getLabReports);

router.get(
    "/:id", 
    protect,
    authorize(
  "admin",
  "doctor",
  "lab_scientist"), 
    getLabReportById);

router.put(
    "/:id", 
    protect, 
    authorize(
  "admin",
  "doctor",
  "lab_scientist"),
    updateLabReport);

router.delete(
    "/:id", 
    protect,
    authorize(
  "admin",
  "doctor",
  "lab_scientist"), 
    deleteLabReport);

export default router;