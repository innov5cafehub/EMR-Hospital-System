import pool from "../config/db.js";

export const createAppointment = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      status,
      notes,
    } = req.body;

    const newAppointment = await pool.query(
      `INSERT INTO appointments
      (
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status || "scheduled",
        notes,
      ]
    );

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const getAppointments = async (req, res) => {
  try {
    const appointments = await pool.query(`
      SELECT
        appointments.*,
        patients.first_name,
        patients.last_name
      FROM appointments
      JOIN patients
      ON appointments.patient_id = patients.id
      ORDER BY appointments.created_at DESC
    `);

    res.status(200).json(appointments.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [id]
    );

    if (appointment.rows.length === 0) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json(appointment.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      status,
      notes,
    } = req.body;

    const updatedAppointment = await pool.query(
      `UPDATE appointments
       SET
         patient_id = $1,
         doctor_id = $2,
         appointment_date = $3,
         appointment_time = $4,
         status = $5,
         notes = $6
       WHERE id = $7
       RETURNING *`,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status,
        notes,
        id,
      ]
    );

    if (updatedAppointment.rows.length === 0) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAppointment = await pool.query(
      "DELETE FROM appointments WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedAppointment.rows.length === 0) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      message: "Appointment deleted successfully",
      appointment: deletedAppointment.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};