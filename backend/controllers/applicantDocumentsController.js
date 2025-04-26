const { db } = require("../database/db.js");

const setDocument = async (req, res) => {
  const {
    id,
    sss,
    pagIbig,
    healthCard,
    medicalResult,
    drugTest,
    bloodTest,
    nbi,
    mayorsPermit,
    tinNumber,
  } = req.body;

  if (
    [
      id,
      sss,
      pagIbig,
      healthCard,
      medicalResult,
      drugTest,
      bloodTest,
      nbi,
      mayorsPermit,
      tinNumber,
    ].some((field) => field === undefined || field === null)
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const getSqlQuery = "SELECT * FROM applicant_documents WHERE id = ?";
    const [rows] = await db.execute(getSqlQuery, [id]);
    insertQuery =
      "INSERT INTO applicant_documents(id, SSS, PAG_IBIG, Health_Card, Medical_Result, Drug_Test, Blood_Test, NBI, Mayors_Permit, Tin_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    updateQuery =
      "UPDATE applicant_documents SET SSS = ?, PAG_IBIG = ?, Health_Card = ?, Medical_Result = ?, Drug_Test = ?, Blood_Test = ?, NBI = ?, Mayors_Permit = ?, Tin_Number = ? WHERE id = ?";

    let parameters = [];
    if (rows.length === 0) {
      parameters = [
        id,
        sss,
        pagIbig,
        healthCard,
        medicalResult,
        drugTest,
        bloodTest,
        nbi,
        mayorsPermit,
        tinNumber,
      ];
    } else {
      parameters = [
        sss,
        pagIbig,
        healthCard,
        medicalResult,
        drugTest,
        bloodTest,
        nbi,
        mayorsPermit,
        tinNumber,
        id,
      ];
    }
    const sqlQuery = rows.length === 0 ? insertQuery : updateQuery;

    const [result] = await db.execute(sqlQuery, parameters);
    return res.status(200).json({
      message: "Successfully added/updated the applicant_document values",
      data: result,
    });
  } catch (e) {
    console.error(e); // log full error internally
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getDocuments = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "id cant be null" });
  }

  try {
    const sqlQuery = "SELECT * FROM applicant_documents WHERE id = ?";
    const [rows] = await db.execute(sqlQuery, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Applicant not found." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM applicant_documents";
    const [rows] = await db.execute(sqlQuery);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No Applicants Found!" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

module.exports = {
  setDocument,
  getDocuments,
  getAllDocuments,
};
