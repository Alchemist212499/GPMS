const express = require("express");
const router = express.Router();
const rpsController = require("../../controllers/rpsController");
router.route("/").get(rpsController.getAllrpsRecords);

module.exports = router;
