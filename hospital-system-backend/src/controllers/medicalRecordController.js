import pool from "../config/db.js";

export const createMedicalRecord = async (req, res) => {
  try {
    const {
      patient_id,
      diagnosis,
      symptoms,
      treatment,
      prescription,
      doctor_notes,
      visit_date,
    } = req.body;

    const newRecord = await pool.query(
      `INSERT INTO medical_records
      (
        patient_id,
        diagnosis,
        symptoms,
        treatment,
        prescription,
        doctor_notes,
        visit_date
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        patient_id,
        diagnosis,
        symptoms,
        treatment,
        prescription,
        doctor_notes,
        visit_date,
      ]
    );

    res.status(201).json({
      message: "Medical record created successfully",
      record: newRecord.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const getMedicalRecords = async (req, res) => {
  try {
    const records = await pool.query(`
      SELECT
        medical_records.*,
        patients.first_name,
        patients.last_name
      FROM medical_records
      JOIN patients
      ON medical_records.patient_id = patients.id
      ORDER BY medical_records.created_at DESC
    `);

    res.status(200).json(records.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await pool.query(
      "SELECT * FROM medical_records WHERE id = $1",
      [id]
    );

    if (record.rows.length === 0) {
      return res.status(404).json({
        message: "Medical record not found",
      });
    }

    res.status(200).json(record.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      diagnosis,
      symptoms,
      treatment,
      prescription,
      doctor_notes,
      visit_date,
    } = req.body;

    const updatedRecord = await pool.query(
      `UPDATE medical_records
       SET
         patient_id = $1,
         diagnosis = $2,
         symptoms = $3,
         treatment = $4,
         prescription = $5,
         doctor_notes = $6,
         visit_date = $7
       WHERE id = $8
       RETURNING *`,
      [
        patient_id,
        diagnosis,
        symptoms,
        treatment,
        prescription,
        doctor_notes,
        visit_date,
        id,
      ]
    );

    if (updatedRecord.rows.length === 0) {
      return res.status(404).json({
        message: "Medical record not found",
      });
    }

    res.status(200).json({
      message: "Medical record updated successfully",
      record: updatedRecord.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecord = await pool.query(
      "DELETE FROM medical_records WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedRecord.rows.length === 0) {
      return res.status(404).json({
        message: "Medical record not found",
      });
    }

    res.status(200).json({
      message: "Medical record deleted successfully",
      record: deletedRecord.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


