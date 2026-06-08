import express from "express";

import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} from "../controllers/billController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/", 
    protect, 
    authorize(
  "admin",
  "cashier"),
    createBill);

router.get(
    "/", 
    protect,
    authorize(
  "admin",
  "cashier"), 
    getBills);

router.get(
    "/:id", 
    protect,
    authorize(
  "admin",
  "cashier"), 
    getBillById);

router.put(
    "/:id", 
    protect,
    authorize(
  "admin",
  "cashier"), 
    updateBill);

router.delete(
    "/:id", 
    protect,
    authorize(
  "admin",
  "cashier"), 
    deleteBill);

export default router;