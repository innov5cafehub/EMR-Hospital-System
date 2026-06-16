import pool from "../config/db.js";

/* =========================
   CREATE PRESCRIPTION
========================= */
export const createPrescription = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      medication_name,
      dosage,
      frequency,
      duration,
      quantity,
      instructions,
    } = req.body;

    if (
      !patient_id ||
      !doctor_id ||
      !medication_name ||
      !dosage ||
      !frequency ||
      !duration
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const newPrescription = await pool.query(
      `INSERT INTO prescriptions (
        patient_id,
        doctor_id,
        medication_name,
        dosage,
        frequency,
        duration,
        quantity,
        instructions
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        patient_id,
        doctor_id,
        medication_name,
        dosage,
        frequency,
        duration,
        quantity || 1,
        instructions || null,
      ]
    );

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: newPrescription.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

/* =========================
   GET ALL PRESCRIPTIONS
========================= */
export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await pool.query(`
      SELECT
        p.*,
        pt.first_name,
        pt.last_name
      FROM prescriptions p
      JOIN patients pt
        ON p.patient_id = pt.id
      ORDER BY p.created_at DESC
    `);

    res.status(200).json(prescriptions.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

/* =========================
   GET SINGLE PRESCRIPTION
========================= */
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await pool.query(
      `SELECT * FROM prescriptions WHERE id = $1`,
      [id]
    );

    if (prescription.rows.length === 0) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.status(200).json(prescription.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

/* =========================
   UPDATE PRESCRIPTION STATUS
========================= */
export const updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const prescriptionResult = await pool.query(
      `SELECT * FROM prescriptions WHERE id = $1`,
      [id]
    );

    if (prescriptionResult.rows.length === 0) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    const prescription = prescriptionResult.rows[0];

    // Prevent double dispensing
    if (
      prescription.status === "dispensed" &&
      status === "dispensed"
    ) {
      return res.status(400).json({
        message: "Prescription has already been dispensed",
      });
    }

    // Reduce stock only when changing to dispensed
    if (
      prescription.status !== "dispensed" &&
      status === "dispensed"
    ) {
      const medicationResult = await pool.query(
        `SELECT *
         FROM medications
         WHERE LOWER(drug_name) = LOWER($1)
         LIMIT 1`,
        [prescription.medication_name]
      );

      if (medicationResult.rows.length === 0) {
        return res.status(404).json({
          message: "Medication not found in inventory",
        });
      }

      const medication = medicationResult.rows[0];

      if (
        Number(medication.quantity) <
        Number(prescription.quantity)
      ) {
        return res.status(400).json({
          message: "Insufficient medication stock",
        });
      }

      await pool.query(
        `UPDATE medications
         SET quantity = quantity - $1
         WHERE id = $2`,
        [prescription.quantity, medication.id]
      );
    }

    const updatedPrescription = await pool.query(
      `UPDATE prescriptions
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    res.status(200).json({
      message: "Prescription status updated successfully",
      prescription: updatedPrescription.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

/* =========================
   DELETE PRESCRIPTION
========================= */
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPrescription = await pool.query(
      `DELETE FROM prescriptions
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (deletedPrescription.rows.length === 0) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      message: "Prescription deleted successfully",
      prescription: deletedPrescription.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};