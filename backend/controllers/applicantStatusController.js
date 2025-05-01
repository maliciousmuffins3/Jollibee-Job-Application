const { db } = require("../database/db.js");

const setStatus = async (req, res) => {
  const { id, status, schedule_date } = req.body;

  if (!id || !status || !schedule_date) {
    return res.status(400).json({ error: "Id, status, and schedule_date are required." });
  }

  try {
    const getStatusQuery = "SELECT * FROM process_status WHERE id = ?";
    const [rows] = await db.execute(getStatusQuery, [id]);

    let setQuery, values;

    if (rows.length === 0) {
      setQuery = "INSERT INTO process_status (status, schedule_date, id) VALUES (?, ?, ?)";
      values = [status, schedule_date, id];
    } else {
      setQuery = "UPDATE process_status SET status = ?, schedule_date = ? WHERE id = ?";
      values = [status, schedule_date, id];
    }

    const [result] = await db.execute(setQuery, values);

    return res.status(200).json({
      message: "Successfully added/updated the status values",
      data: result,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getStatus = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Id cant be null" });
  }

  try {
    const getStatusQuery = "SELECT * FROM process_status WHERE id = ?";
    const [rows] = await db.execute(getStatusQuery, [id]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "ID cant be found!" });
    }

    return res.status(200).json(rows[0]);
  } catch (e) {
    console.error(e); // log full error internally
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getAllStatus = async (req, res) => {
  try {
    const getStatusQuery = "SELECT * FROM process_status";
    const [rows] = await db.execute(getStatusQuery);
    if (rows.length === 0) {
      return res.status(400).json({ error: "No applicants found!" });
    }

    return res.status(200).json(rows);
  } catch (e) {
    console.error(e); // log full error internally
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

module.exports = { setStatus, getStatus, getAllStatus };
