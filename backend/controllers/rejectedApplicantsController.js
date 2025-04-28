const { db } = require("../database/db.js");
const { getPhTimeDate } = require("../utils/getPHT.js");

const setRejectedApplicant = async (req, res) => {
  const { id, fullName, email, phoneNumber } = req.body;

  if (!id || !fullName || !email || !phoneNumber) {
    return res.status(400).json({ error: "All key's must be valid!" });
  }

  try {
    const insertQuery =
      "INSERT INTO rejected_applicants(id, full_name, email, phone_number, date) VALUES(?, ?, ?, ?, ?)";
    const [result] = await db.execute(insertQuery, [
      id,
      fullName,
      email,
      phoneNumber,
      new Date(),
    ]);
    return res.status(200).json({
      message: "Successfully added the rejected applicant",
      data: result,
    });
  } catch (e) {
    console.error(e); // log full error internally
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getRejectedApplicant = async (req, res) => {
  const { id, fullName, email } = req.query;

  if (!id || !fullName || !email) {
    return res.status(400).json({ error: "All keys must be defined!" });
  }
  try {
    const selectQuery =
      "SELECT * from rejected_applicants WHERE id = ? OR email = ? OR full_name = ?";
    const [rows] = await db.execute(selectQuery, [id, email, fullName]);
    if (!rows) {
      res.status(400).json({ error: "Applicant can't be found!" });
    }

    res.status(200).json(rows[0]);
  } catch (e) {
    console.error(e); // log full error internally
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getAllRejectedApplicants = async (req, res) => {
  try {
    const selectQuery = "SELECT * from rejected_applicants";
    const [rows] = await db.execute(selectQuery);
    if (!rows) {
      res.status(400).json({ error: "Applicant can't be found!" });
    }

    res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const deleteRejects = async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const deleteQuery = "DELETE FROM rejected_applicants WHERE date < ?";
        const [result] = await db.execute(deleteQuery, [oneMonthAgo]);

        res.status(200).json({
            message: "Successfully deleted old rejected applicants",
            deletedRows: result.affectedRows,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
};

module.exports = {
  setRejectedApplicant,
  getRejectedApplicant,
  getAllRejectedApplicants,
  deleteRejects,
};
