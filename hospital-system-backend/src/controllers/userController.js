import pool from "../config/db.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );

    res.status(200).json(users.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

// GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2
       RETURNING id, name, email, role`,
      [role, id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};


// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await pool.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING id, name, email, role`,
      [id]
    );

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
};