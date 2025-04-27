const express = require("express");
const { addAvailablePosition, removeAvailablePosition, getPosition, getAllPosition } = require("../controllers/availablePositionController.js");

const router = express.Router();

router.post("/add-position", addAvailablePosition);
router.delete("/remove-position", removeAvailablePosition);
router.get("/show-positions", getAllPosition);
router.get("/get-position", getPosition);



module.exports = router;