import pool from "../config/db.js";
import { logAudit } from "../utils/auditLogger.js";

export const createPatient = async (req, res) => {
  try {
    const {
      patient_number,
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      address,
      blood_group,
      emergency_contact,
    } = req.body;

    const newPatient = await pool.query(
      `INSERT INTO patients 
      (
        patient_number,
        first_name,
        last_name,
        gender,
        date_of_birth,
        phone,
        address,
        blood_group,
        emergency_contact
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        patient_number,
        first_name,
        last_name,
        gender,
        date_of_birth,
        phone,
        address,
        blood_group,
        emergency_contact,
      ]
    );

    await logAudit(
  req.user.id,
  "Created Patient",
  "Patients",
  newPatient.rows[0].id
);

    res.status(201).json({
      message: "Patient created successfully",
      patient: newPatient.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await pool.query(
      "SELECT * FROM patients ORDER BY created_at DESC"
    );

    res.status(200).json(patients.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await pool.query(
      "SELECT * FROM patients WHERE id = $1",
      [id]
    );

    if (patient.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json(patient.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_number,
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      address,
      blood_group,
      emergency_contact,
    } = req.body;

    const updatedPatient = await pool.query(
      `UPDATE patients
       SET
         patient_number = $1,
         first_name = $2,
         last_name = $3,
         gender = $4,
         date_of_birth = $5,
         phone = $6,
         address = $7,
         blood_group = $8,
         emergency_contact = $9
       WHERE id = $10
       RETURNING *`,
      [
        patient_number,
        first_name,
        last_name,
        gender,
        date_of_birth,
        phone,
        address,
        blood_group,
        emergency_contact,
        id,
      ]
    );

    if (updatedPatient.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    await logAudit(
  req.user.id,
  "Updated Patient",
  "Patients",
  id
);

    res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPatient = await pool.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedPatient.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    await logAudit(
  req.user.id,
  "Deleted Patient",
  "Patients",
  id
);

    res.status(200).json({
      message: "Patient deleted successfully",
      patient: deletedPatient.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};