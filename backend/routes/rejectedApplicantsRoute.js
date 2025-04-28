const express = require("express");
const router = express.Router();
const {
  setRejectedApplicant,
  getRejectedApplicant,
  getAllRejectedApplicants,
  deleteRejects
} = require("../controllers/rejectedApplicantsController.js");

router.post("/add-reject-applicants",setRejectedApplicant);
router.get("/get-specific-rejected-applicant", getRejectedApplicant);
router.get("/get-all-rejected-applicants",getAllRejectedApplicants);
router.delete("/delete-all-due-rejects",deleteRejects);

module.exports = router;
