const express = require('express')
const router = express.Router();
const { setDocument, updateDocuments, getDocuments, getAllDocuments } = require("../controllers/applicantDocumentsController.js");

router.post("/set-documents",setDocument);
router.get("/get-document",getDocuments);
router.get("/get-documents",getAllDocuments);

module.exports = router;