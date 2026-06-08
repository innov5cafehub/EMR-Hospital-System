import pool from "../config/db.js";

export const createBill = async (req, res) => {
  try {
    const {
      patient_id,
      amount,
      description,
      status,
      payment_date,
    } = req.body;

    const newBill = await pool.query(
      `INSERT INTO bills
      (
        patient_id,
        amount,
        description,
        status,
        payment_date
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        patient_id,
        amount,
        description,
        status || "unpaid",
        payment_date,
      ]
    );

    res.status(201).json({
      message: "Bill created successfully",
      bill: newBill.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const getBills = async (req, res) => {
  try {
    const bills = await pool.query(`
      SELECT
        bills.*,
        patients.first_name,
        patients.last_name
      FROM bills
      JOIN patients
      ON bills.patient_id = patients.id
      ORDER BY bills.created_at DESC
    `);

    res.status(200).json(bills.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await pool.query(
      "SELECT * FROM bills WHERE id = $1",
      [id]
    );

    if (bill.rows.length === 0) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    res.status(200).json(bill.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patient_id,
      amount,
      description,
      status,
      payment_date,
    } = req.body;

    const updatedBill = await pool.query(
      `UPDATE bills
       SET
         patient_id = $1,
         amount = $2,
         description = $3,
         status = $4,
         payment_date = $5
       WHERE id = $6
       RETURNING *`,
      [
        patient_id,
        amount,
        description,
        status,
        payment_date,
        id,
      ]
    );

    if (updatedBill.rows.length === 0) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    res.status(200).json({
      message: "Bill updated successfully",
      bill: updatedBill.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};



export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBill = await pool.query(
      "DELETE FROM bills WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedBill.rows.length === 0) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    res.status(200).json({
      message: "Bill deleted successfully",
      bill: deletedBill.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};