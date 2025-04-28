const { db } = require("../database/db.js");
const fs = require("fs");
const path = require('path');

const addApplicant = async (req, res) => {
  // const exampleBody = {
  //     fullName: "name",
  //     email: "matthewroxas29@gmail.com",
  //     phoneNumber: "09123940952",
  //     resume: true,
  // }

  const { fullName, email, phoneNumber } = req.body;
  const isResumeExist = req.file ? true : false;
  const data = req.file.buffer;

  if (!fullName || !email || !phoneNumber || !isResumeExist) {
    return res.status(500).json({ message: "Keys must not be null" });
  }

  try {
    // Custom file path and name logic
    const customDirectory = [fullName, req.file.originalname].join("/") + "/";
    const customFileName = req.file.originalname; // You can customize the name here

    const sqlQuery =
      "INSERT INTO applicants (email, full_name, phone_number, resume) VALUES (?, ?, ?, ?)";
    const [rows] = await db.execute(sqlQuery, [
      email,
      fullName,
      phoneNumber,
      req.file.originalname,
    ]);

    return res.status(200).json({
      message: "Applicant added successfully",
      uploadMessage: "Upload successful",
      data: rows,
    });
  } catch (e) {
    console.error("Failed to addApplicant: " + e);
    return res.status(500).json({ error: "Failed to add applicant" });
  }
};

const getApplicants = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM applicants";
    const [results] = await db.execute(sqlQuery);
    if (results.length === 0) {
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

  if (id !== null && id !== "") {
    conditions.push("id = ?");
    params.push(id);
  }
  if (fullName !== null && fullName !== "") {
    conditions.push("full_name = ?");
    params.push(fullName);
  }
  if (email !== null && email !== "") {
    conditions.push("email = ?");
    params.push(email);
  }

  // No valid query parameters passed
  if (conditions.length === 0) {
    return res.status(400).json({
      error:
        "At least one valid query parameter (id, fullName, or email) is required.",
    });
  }

  try {
    const sqlQuery =
      "SELECT * FROM applicants WHERE " + conditions.join(" OR ");
    const [rows] = await db.execute(sqlQuery, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Applicant not found." });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching applicant:", error);
    return res
      .status(500)
      .json({ error: "GET applicant request error: " + error.message });
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
      return res.status(400).json({
        error: "Must provide at least one identifier (id, fullName, email)",
      });
    }

    const sqlQuery = `DELETE FROM applicants WHERE ${conditions.join(" OR ")}`;
    const [rows] = await db.execute(sqlQuery, values);
    return res.status(200).json({ affectedRows: rows.affectedRows });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to delete applicant: " + err });
  }
};



const downloadResume = (req, res) => {
  const { fullName, fileName } = req.params;
  const filePath = path.join('uploads', fullName, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  return res.sendFile(path.resolve(filePath));
};


const deleteResume = (req, res) => {
  const { fullName, fileName } = req.params;
  const filePath = path.join('uploads', fullName, fileName);
  const folderPath = path.join('uploads', fullName);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting file' });
    }

    // Check if the directory is empty after file deletion
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error checking directory' });
      }

      // If the directory is empty, delete the folder
      if (files.length === 0) {
        fs.rmdir(folderPath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting folder' });
          }

          return res.status(200).json({ message: 'File and folder deleted successfully' });
        });
      } else {
        return res.status(200).json({ message: 'File deleted successfully, but folder is not empty' });
      }
    });
  });
};


module.exports = { addApplicant, getApplicant, getApplicants, deleteApplicant, downloadResume, deleteResume};
