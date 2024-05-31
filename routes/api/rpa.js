const express = require("express");
const router = express.Router();
const rpaController = require("../../controllers/rpaController");
router
  .route("/")
  .get(rpaController.getAllrpaRecords)
  .post(rpaController.createNewrpaRecord)
  .put(rpaController.updaterpaRecord);
module.exports = router;
