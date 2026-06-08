import pool from "../config/db.js";

export const createLabReport = async (req, res) => {
  try {
    const {
      patient_id,
      test_name,
      test_result,
      status,
      remarks,
      test_date,
    } = req.body;

    const newReport = await pool.query(
      `INSERT INTO lab_reports
      (
        patient_id,
        test_name,
        test_result,
        status,
        remarks,
        test_date
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        patient_id,
        test_name,
        test_result,
        status || "pending",
        remarks,
        test_date,
      ]
    );

    res.status(201).json({
      message: "Lab report created successfully",
      report: newReport.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getLabReports = async (req, res) => {
  try {
    const reports = await pool.query(`
      SELECT
        lab_reports.*,
        patients.first_name,
        patients.last_name
      FROM lab_reports
      JOIN patients
      ON lab_reports.patient_id = patients.id
      ORDER BY lab_reports.created_at DESC
    `);

    res.status(200).json(reports.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const getLabReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await pool.query(
      "SELECT * FROM lab_reports WHERE id = $1",
      [id]
    );

    if (report.rows.length === 0) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    res.status(200).json(report.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const updateLabReport = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      test_name,
      test_result,
      status,
      remarks,
      test_date,
    } = req.body;

    const updatedReport = await pool.query(
      `UPDATE lab_reports
       SET
         patient_id = $1,
         test_name = $2,
         test_result = $3,
         status = $4,
         remarks = $5,
         test_date = $6
       WHERE id = $7
       RETURNING *`,
      [
        patient_id,
        test_name,
        test_result,
        status,
        remarks,
        test_date,
        id,
      ]
    );

    if (updatedReport.rows.length === 0) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    res.status(200).json({
      message: "Lab report updated successfully",
      report: updatedReport.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const deleteLabReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReport = await pool.query(
      "DELETE FROM lab_reports WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedReport.rows.length === 0) {
      return res.status(404).json({
        message: "Lab report not found",
      });
    }

    res.status(200).json({
      message: "Lab report deleted successfully",
      report: deletedReport.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};