const { db } = require("../database/db.js");

const addAvailablePosition = async (req, res) => {
  const { role, requirements } = req.body;

  // Check if both role and requirements are provided
  if (!role || !requirements) {
    return res.status(400).json({ error: "Role and requirements must not be null!" });
  }

  try {
    // Insert the correct values for role and requirements into the database
    const insertQuery =
      "INSERT INTO available_positions(role, requirements) VALUES(?, ?)";
    
    // Make sure to insert role and requirements correctly
    const [results] = await db.execute(insertQuery, [role, requirements]);

    return res.status(200).json({
      message: "Successfully added new available position!",
      data: results,
    });
  } catch (e) {
    console.error(e); // Log full error internally for debugging
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};


const removeAvailablePosition = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID can'be null" });
  }

  try {
    const deleteQuery = "DELETE FROM available_positions WHERE id = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    return res
      .status(200)
      .json({ message: "Successfully deleted the position", data: result });
  } catch (e) {
    console.error(e); // log full error internally
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getPosition = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID can'be null" });
  }

  try {
    const getQuery = "SELECT * FROM available_positions WHERE id = ?";
    const [rows] = await db.execute(getQuery, [id]);
    if(!rows){
      return res.status(400).json({error: "Available Position not found!"});
    }
    return res.status(200).json(rows[0]);
  } catch (e) {
    console.error(e); // log full error internally
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getAllPosition = async (req, res) => {
  try {
    const getQuery = "SELECT * FROM available_positions";
    const [rows] = await db.execute(getQuery);
    if(!rows){
      return res.status(400).json({error: "Available Position not found!"});
    }
    return res.status(200).json(rows);
  } catch (e) {
    console.error(e); // log full error internally
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

module.exports = {
  addAvailablePosition,
  removeAvailablePosition,
  getPosition,
  getAllPosition,
};
