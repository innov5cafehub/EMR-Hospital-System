import pool from "../config/db.js";

// GET ALL BEDS
export const getBeds = async (req, res) => {
  try {
    const beds = await pool.query(`
      SELECT
        b.id,
        w.ward_name,
        b.bed_number,
        b.status
      FROM beds b
      JOIN wards w
      ON b.ward_id = w.id
      ORDER BY w.ward_name
    `);

    res.status(200).json(beds.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

// AVAILABLE BEDS
export const getAvailableBeds = async (req, res) => {
  try {
    const beds = await pool.query(`
      SELECT
        b.id,
        w.ward_name,
        b.bed_number
      FROM beds b
      JOIN wards w
      ON b.ward_id = w.id
      WHERE b.status = 'available'
      ORDER BY w.ward_name
    `);

    res.status(200).json(beds.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


// BED STATISTICS
export const getBedStatistics = async (req, res) => {
  try {
    const totalBeds = await pool.query(`
      SELECT COUNT(*) AS total
      FROM beds
    `);

    const availableBeds = await pool.query(`
      SELECT COUNT(*) AS total
      FROM beds
      WHERE status = 'available'
    `);

    const occupiedBeds = await pool.query(`
      SELECT COUNT(*) AS total
      FROM beds
      WHERE status = 'occupied'
    `);

    res.status(200).json({
      total_beds: Number(totalBeds.rows[0].total),
      available_beds: Number(availableBeds.rows[0].total),
      occupied_beds: Number(occupiedBeds.rows[0].total),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};