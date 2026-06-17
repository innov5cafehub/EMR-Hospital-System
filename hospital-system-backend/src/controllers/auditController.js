import pool from "../config/db.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await pool.query(`
      SELECT
        audit_logs.*,
        users.name,
        users.role
      FROM audit_logs
      LEFT JOIN users
      ON audit_logs.user_id = users.id
      ORDER BY audit_logs.created_at DESC
    `);

    res.status(200).json(logs.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};