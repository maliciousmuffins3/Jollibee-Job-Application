const express = require('express')
const router = express.Router();
const {addApplicant, getApplicant, getApplicants, deleteApplicant} = require("../controllers/applicantController")


router.post("/add-applicant",addApplicant);
router.get("/get-applicant",getApplicant);
router.get("/get-applicants",getApplicants);
router.delete("/delete-applicant",deleteApplicant);

module.exports = router;