const express = require("express");
const router = express.Router();
const {
  addApplicant,
  getApplicant,
  getApplicants,
  deleteApplicant,
  downloadResume,
  deleteResume
} = require("../controllers/applicantController");
const multer = require('multer');
const fs = require('fs');

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Assuming `fullName` comes from the request body
    const { fullName } = req.body;
    const customDirectory = `uploads/${fullName}/`; // Custom path based on fullName

    // Ensure the directory exists
    if (!fs.existsSync(customDirectory)) {
      fs.mkdirSync(customDirectory, { recursive: true });
    }
    cb(null, customDirectory); // File will be saved in this directory
  },
  filename: (req, file, cb) => {
    const customFileName = file.originalname; // Keep the original filename (or you can modify this)
    cb(null, customFileName); // Save with original filename
  },
});

const upload = multer({ storage });

router.post("/add-applicant", upload.single("file"), addApplicant);
router.get("/get-applicant", getApplicant);
router.get("/get-applicants", getApplicants);
router.delete("/delete-applicant", deleteApplicant);

// 🎯 Corrected endpoints:
router.get("/file/:fullName/:fileName", downloadResume);
router.delete("/file/:fullName/:fileName", deleteResume);

module.exports = router;
