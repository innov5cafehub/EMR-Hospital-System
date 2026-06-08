import pool from "../config/db.js";

export const createMedication = async (req, res) => {
  try {
    const {
      drug_name,
      category,
      quantity,
      unit_price,
      expiry_date,
    } = req.body;

    const newMedication = await pool.query(
      `INSERT INTO medications
      (
        drug_name,
        category,
        quantity,
        unit_price,
        expiry_date
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        drug_name,
        category,
        quantity,
        unit_price,
        expiry_date,
      ]
    );

    res.status(201).json({
      message: "Medication created successfully",
      medication: newMedication.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getMedications = async (req, res) => {
  try {
    const medications = await pool.query(
      "SELECT * FROM medications ORDER BY created_at DESC"
    );

    res.status(200).json(medications.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const getMedicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const medication = await pool.query(
      "SELECT * FROM medications WHERE id = $1",
      [id]
    );

    if (medication.rows.length === 0) {
      return res.status(404).json({
        message: "Medication not found",
      });
    }

    res.status(200).json(medication.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      drug_name,
      category,
      quantity,
      unit_price,
      expiry_date,
    } = req.body;

    const updatedMedication = await pool.query(
      `UPDATE medications
       SET
         drug_name = $1,
         category = $2,
         quantity = $3,
         unit_price = $4,
         expiry_date = $5
       WHERE id = $6
       RETURNING *`,
      [
        drug_name,
        category,
        quantity,
        unit_price,
        expiry_date,
        id,
      ]
    );

    if (updatedMedication.rows.length === 0) {
      return res.status(404).json({
        message: "Medication not found",
      });
    }

    res.status(200).json({
      message: "Medication updated successfully",
      medication: updatedMedication.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMedication = await pool.query(
      "DELETE FROM medications WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedMedication.rows.length === 0) {
      return res.status(404).json({
        message: "Medication not found",
      });
    }

    res.status(200).json({
      message: "Medication deleted successfully",
      medication: deletedMedication.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};