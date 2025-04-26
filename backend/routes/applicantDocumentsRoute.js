const express = require('express')
const router = express.Router();
const { addDocuments, updateDocuments, getDocuments, getAllDocuments } = require("../controllers/applicantDocumentsController.js");

router.post("/add-documents",addDocuments);
router.put("/update-documents",updateDocuments);
router.get("/get-document",getDocuments);
router.get("/get-documents",getAllDocuments);

module.exports = router;