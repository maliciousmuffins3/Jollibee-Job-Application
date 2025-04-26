const { db } = require("../database/db.js");

const addApplicant = async (req, res) => {
  // const exampleBody = {
  //     fullName: "name",
  //     email: "matthewroxas29@gmail.com",
  //     phoneNumber: "09123940952",
  //     resume: true,
  // }

  const { fullName, email, phoneNumber, resume } = req.body;

    if(!fullName || !email || !phoneNumber || !resume){
      return res.status(500).json({message: "Keys must not be null"});
  }

  try {
    const sqlQuery =
      "INSERT INTO applicants (email, full_name, phone_number, resume) VALUES (?, ?, ?, ?)";
    const [rows] = await db.execute(sqlQuery, [
      email,
      fullName,
      phoneNumber,
      resume,
    ]);

    return res
      .status(200)
      .json({ message: "Applicant added successfully", data: rows });
  } catch (e) {
    console.error("Failed to addApplicant: " + e);
    return res.status(500).json({ error: "Failed to add applicant" });
  }
};

const getApplicants = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM applicants";
    const [results] = await db.execute(sqlQuery);
    if (results.length === 0){
      return res.status(404).json({ error: "No Applicants Found" });
    }
    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: "Failed to get all applicants" });
  }
};

const getApplicant = async (req, res) => {
  let { id, fullName, email } = req.query;

  // Normalize: if missing or empty, treat them as null
  id = id ?? null;
  fullName = fullName ?? null;
  email = email ?? null;

  // Collect dynamic conditions
  const conditions = [];
  const params = [];

  if (id !== null && id !== '') {
      conditions.push("id = ?");
      params.push(id);
  }
  if (fullName !== null && fullName !== '') {
      conditions.push("full_name = ?");
      params.push(fullName);
  }
  if (email !== null && email !== '') {
      conditions.push("email = ?");
      params.push(email);
  }

  // No valid query parameters passed
  if (conditions.length === 0) {
      return res.status(400).json({ error: "At least one valid query parameter (id, fullName, or email) is required." });
  }

  try {
      const sqlQuery = "SELECT * FROM applicants WHERE " + conditions.join(" OR ");
      const [rows] = await db.execute(sqlQuery, params);

      if (rows.length === 0) {
          return res.status(404).json({ error: "Applicant not found." });
      }

      return res.status(200).json(rows[0]);
  } catch (error) {
      console.error("Error fetching applicant:", error);
      return res.status(500).json({ error: "GET applicant request error: " + error.message });
  }
};


const deleteApplicant = async (req, res) => {
  const { id, fullName, email } = req.query;

  try {
    const conditions = [];
    const values = [];

    if (id) {
      conditions.push("id = ?");
      values.push(id);
    }
    if (fullName) {
      conditions.push("full_name = ?");
      values.push(fullName);
    }
    if (email) {
      conditions.push("email = ?");
      values.push(email);
    }

    if (conditions.length === 0) {
      return res
        .status(400)
        .json({
          error: "Must provide at least one identifier (id, fullName, email)",
        });
    }

    const sqlQuery = `DELETE FROM applicants WHERE ${conditions.join(
      " OR "
    )}`;
    const [rows] = await db.execute(sqlQuery, values);
    return res.status(200).json({ affectedRows: rows.affectedRows });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete applicant: " + err });
  }
};

module.exports = { addApplicant, getApplicant, getApplicants, deleteApplicant };
