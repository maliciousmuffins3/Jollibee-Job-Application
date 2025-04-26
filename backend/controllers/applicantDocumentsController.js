const { db } = require("../database/db.js");

const addDocuments = async (req, res) => {
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
    const sqlQuery =
      "INSERT INTO applicant_documents(id, SSS, PAG_IBIG, Health_Card, Medical_Result, Drug_Test, Blood_Test, NBI, Mayors_Permit, Tin_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sqlQuery, [
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
    ]);
    res.status(200).json({
      message: "Successfully added the applicant_document values",
      data: result,
    });
  } catch (e) {
    console.error(e); // log full error internally
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const updateDocuments = async (req, res) => {
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
    const sqlQuery =
      "UPDATE applicant_documents SET SSS = ?, PAG_IBIG = ?, Health_Card = ?, Medical_Result = ?, Drug_Test = ?, Blood_Test = ?, NBI = ?, Mayors_Permit = ?, Tin_Number = ? WHERE id = ?";
    const [result] = await db.execute(sqlQuery, [
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
    ]);

    res.status(200).json({
      message: "Successfully updated the applicant_documents table",
      data: result,
    });
  } catch (e) {
    console.error(e); // log full error internally
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getDocuments = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: "id cant be null" });
  }

  try {
    const sqlQuery = "SELECT * FROM applicant_documents WHERE id = ?";
    const [rows] = await db.execute(sqlQuery, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Applicant not found." });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM applicant_documents";
    const [rows] = await db.execute(sqlQuery);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No Applicants Found!" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

module.exports = { addDocuments, updateDocuments, getDocuments, getAllDocuments };
