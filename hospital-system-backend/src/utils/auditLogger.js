import pool from "../config/db.js";

export const logAudit = async (
  userId,
  action,
  module,
  recordId = null
) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs
       (user_id, action, module, record_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, action, module, recordId]
    );
  } catch (error) {
    console.error("Audit Log Error:", error);
  }
};