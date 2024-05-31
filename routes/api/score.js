const express = require("express");
const router = express.Router();
const scoreController = require("../../controllers/scoreController");

router
  .route("/")
  .get(scoreController.getAllScoreRecords)
  .post(scoreController.getScoreRecord)
  .put(scoreController.updateScoreRecord);
module.exports = router;
