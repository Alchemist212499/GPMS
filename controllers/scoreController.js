const { update, findByColumn, selectAll } = require("../config/db");

const getAllScoreRecords = async (req, res) => {
  const rst = await selectAll("score");
  console.log("getAllScoreRecords:", rst);
  if (rst.error) {
    res.status(400).json({ message: rst.error });
  } else {
    if (rst.length) {
      res.status(200).json({
        message: "all scoreRecords fetched successfully!",
        info: rst,
      });
    } else {
      res
        .status(404)
        .json({ message: "scoreReords not found...", info: rst.value });
    }
  }
};

const getScoreRecord = async (req, res) => {
  const rst = await findByColumn("score", "ScoredStudentFID", [
    req.body.ScoredStudentFID,
  ]);
  console.log("getScoreRecord:", rst);
  if (rst.error) {
    res.status(400).json({ message: rst.error });
  } else {
    if (rst.length) {
      res.status(200).json({
        message: "scoreRecord fetched successfully!",
        info: rst,
      });
    } else {
      res
        .status(404)
        .json({ message: "ScoredStudentFID not found...", info: rst.value });
    }
  }
};

const updateScoreRecord = async (req, res) => {
  const rst = await update(
    "score",
    Object.keys(req.body).slice(1),
    Object.values(req.body).slice(1),
    [Object.keys(req.body)[0]],
    [Object.values(req.body)[0]]
  );
  console.log("updateScoreRecord:", rst);
  if (rst.error) {
    res.status(400).json({ message: rst.error });
  } else {
    if (rst.affectedRows) {
      res.status(201).json({
        message: "scoreRecord updated successfully!",
      });
    } else {
      res
        .status(404)
        .json({ message: "ScoredStudentFID not found...", info: rst.value });
    }
  }
};

module.exports = { getAllScoreRecords, getScoreRecord, updateScoreRecord };
