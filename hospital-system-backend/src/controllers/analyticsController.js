import pool from "../config/db.js";

export const getOverviewAnalytics = async (req, res) => {
  try {
    const totalPatients = await pool.query(
      `SELECT COUNT(*) AS total FROM patients`
    );

    const activeAdmissions = await pool.query(
      `SELECT COUNT(*) AS total
       FROM admissions
       WHERE status = 'admitted'`
    );

    const availableBeds = await pool.query(
      `SELECT COUNT(*) AS total
       FROM beds
       WHERE status = 'available'`
    );

    const occupiedBeds = await pool.query(
      `SELECT COUNT(*) AS total
       FROM beds
       WHERE status = 'occupied'`
    );

    const totalAppointments = await pool.query(
      `SELECT COUNT(*) AS total FROM appointments`
    );

    const totalPrescriptions = await pool.query(
      `SELECT COUNT(*) AS total FROM prescriptions`
    );

    const totalBills = await pool.query(
      `SELECT COUNT(*) AS total FROM bills`
    );

    const totalRevenue = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS revenue
       FROM bills`
    );

    res.status(200).json({
      totalPatients: Number(totalPatients.rows[0].total),
      activeAdmissions: Number(activeAdmissions.rows[0].total),
      availableBeds: Number(availableBeds.rows[0].total),
      occupiedBeds: Number(occupiedBeds.rows[0].total),
      totalAppointments: Number(totalAppointments.rows[0].total),
      totalPrescriptions: Number(totalPrescriptions.rows[0].total),
      totalBills: Number(totalBills.rows[0].total),
      totalRevenue: Number(totalRevenue.rows[0].revenue),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};