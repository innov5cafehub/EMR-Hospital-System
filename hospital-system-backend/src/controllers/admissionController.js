import pool from "../config/db.js";

/* =========================
   ADMIT PATIENT
========================= */
export const admitPatient = async (req, res) => {
  try {
    const {
      patient_id,
      bed_id,
      admission_reason,
    } = req.body;

    // Check bed
    const bedResult = await pool.query(
      `SELECT * FROM beds WHERE id = $1`,
      [bed_id]
    );

    if (bedResult.rows.length === 0) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    const bed = bedResult.rows[0];

    if (bed.status === "occupied") {
      return res.status(400).json({
        message: "Bed already occupied",
      });
    }

    // Admit patient
    const admission = await pool.query(
      `INSERT INTO admissions (
        patient_id,
        bed_id,
        admission_reason
      )
      VALUES ($1,$2,$3)
      RETURNING *`,
      [
        patient_id,
        bed_id,
        admission_reason,
      ]
    );

    // Occupy bed
    await pool.query(
      `UPDATE beds
       SET status = 'occupied'
       WHERE id = $1`,
      [bed_id]
    );

    res.status(201).json({
      message: "Patient admitted successfully",
      admission: admission.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

/* =========================
   GET ALL ADMISSIONS
========================= */
export const getAdmissions = async (req, res) => {
  try {
    const admissions = await pool.query(`
      SELECT
        a.*,
        p.first_name,
        p.last_name
      FROM admissions a
      JOIN patients p
      ON a.patient_id = p.id
      ORDER BY a.created_at DESC
    `);

    res.status(200).json(admissions.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   GET SINGLE ADMISSION
========================= */
export const getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await pool.query(
      `SELECT * FROM admissions WHERE id = $1`,
      [id]
    );

    if (admission.rows.length === 0) {
      return res.status(404).json({
        message: "Admission not found",
      });
    }

    res.status(200).json(admission.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   DISCHARGE PATIENT
========================= */
export const dischargePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { discharge_notes } = req.body;

    const admission = await pool.query(
      `SELECT * FROM admissions WHERE id = $1`,
      [id]
    );

    if (admission.rows.length === 0) {
      return res.status(404).json({
        message: "Admission not found",
      });
    }

    if (admission.rows[0].status === "discharged") {
      return res.status(400).json({
        message: "Patient already discharged",
      });
    }

    if (admission.rows[0].bed_id) {
  await pool.query(
    `UPDATE beds
     SET status = 'available'
     WHERE id = $1`,
    [admission.rows[0].bed_id]
  );
}

    const discharged = await pool.query(
      `UPDATE admissions
       SET
         status = 'discharged',
         discharge_date = CURRENT_TIMESTAMP,
         discharge_notes = $1
       WHERE id = $2
       RETURNING *`,
      [discharge_notes, id]
    );

    res.status(200).json({
      message: "Patient discharged successfully",
      admission: discharged.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   DELETE ADMISSION
========================= */
export const deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await pool.query(
      `DELETE FROM admissions
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({
        message: "Admission not found",
      });
    }

    res.status(200).json({
      message: "Admission deleted successfully",
      admission: deleted.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};