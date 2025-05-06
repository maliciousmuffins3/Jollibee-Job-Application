const express = require("express");
const router = express.Router();
const { setStatus, getStatus, getAllStatus, updateAttended } = require("../controllers/applicantStatusController.js");

router.post("/set-status", setStatus);
router.get("/get-applicant-status", getStatus);
router.get("/get-all-applicant-status", getAllStatus);
router.post("/update-attended", updateAttended);


module.exports = router;
