const express = require("express");
const router = express.Router();
const spaController = require("../../controllers/spaController");
router
  .route("/")
  .get(spaController.getAllspaRecords)
  .post(spaController.createNewspaRecord)
  .put(spaController.updatespaRecord);

module.exports = router;
