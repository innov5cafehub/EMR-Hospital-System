import express from "express";

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize(
    "admin",
    "doctor",
    "receptionist"
  ),
  createAppointment
);

router.get(
  "/",
  protect,
  authorize(
    "admin",
    "doctor",
    "receptionist"
  ),
  getAppointments
);

router.get(
  "/:id",
  protect,
  authorize(
    "admin",
    "doctor",
    "receptionist"
  ),
  getAppointmentById
);

router.put(
  "/:id",
  protect,
  authorize(
    "admin",
    "doctor",
    "receptionist"
  ),
  updateAppointment
);

router.delete(
  "/:id",
  protect,
  authorize(
    "admin",
    "doctor",
    "receptionist"
  ),
  deleteAppointment
);
export default router;