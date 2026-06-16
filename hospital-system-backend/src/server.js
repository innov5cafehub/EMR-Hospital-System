import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import labReportRoutes from "./routes/labReportRoutes.js";
import medicationRoutes from "./routes/medicationRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import bedRoutes from "./routes/bedRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/lab-reports", labReportRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/analytics", analyticsRoutes);

import { protect } from "./middleware/authMiddleware.js";

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Hospital API Running",
      databaseTime: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});