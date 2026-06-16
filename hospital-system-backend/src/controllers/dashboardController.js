import pool from "../config/db.js";

export const getPatientDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    // Patient Info
    const patient = await pool.query(
      `SELECT * FROM patients WHERE id = $1`,
      [id]
    );

    if (patient.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // Appointments
    const appointments = await pool.query(
      `SELECT *
       FROM appointments
       WHERE patient_id = $1
       ORDER BY appointment_date DESC`,
      [id]
    );

    // Medical Records
    const medicalRecords = await pool.query(
      `SELECT *
       FROM medical_records
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    // Lab Reports
    const labReports = await pool.query(
      `SELECT *
       FROM lab_reports
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    // Prescriptions
    const prescriptions = await pool.query(
      `SELECT *
       FROM prescriptions
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    // Bills
    const bills = await pool.query(
      `SELECT *
       FROM bills
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    //admission 
    const admissions = await pool.query(
  `SELECT *
   FROM admissions
   WHERE patient_id = $1
   ORDER BY admission_date DESC`,
  [id]
);

    res.status(200).json({
  patient: patient.rows[0],

  stats: {
  admissions: admissions.rows.length,
  appointments: appointments.rows.length,
  medicalRecords: medicalRecords.rows.length,
  labReports: labReports.rows.length,
  prescriptions: prescriptions.rows.length,
  bills: bills.rows.length,
},

  admissions: admissions.rows,
  appointments: appointments.rows,
  medicalRecords: medicalRecords.rows,
  labReports: labReports.rows,
  prescriptions: prescriptions.rows,
  bills: bills.rows,
});



  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};