const { selectAll, insert, update } = require("../config/db");
const { C_rpaCreateSchema, P_rpaUpdateSchema } = require("../model/rpaSchema");

const getAllrpaRecords = async (req, res) => {
  const rpaRecords = await selectAll("rpa_view");
  if (!rpaRecords) {
    return res.status(204).json({ message: "No rpa Records found" });
  }
  res.json({ message: "rpaRecords successfully fetched!", info: rpaRecords });
};

const createNewrpaRecord = async (req, res) => {
  /* const rpaCreateSchema = await C_rpaCreateSchema();
  const result = rpaCreateSchema.validate(req.body, {
    abortEarly: false,
  });
  if (result.error) {
    return res.status(400).json({ message: result.error.details });
  } */

  const newrpaRecord = await insert(
    "RPA",
    Object.keys(req.body),
    Object.values(req.body)
  );
  if (newrpaRecord.error) {
    res.status(400).json({ message: newrpaRecord.error });
  } else {
    res.status(201).json({
      message: "New rpaRecord created successfully!",
    });
  }
};

const updaterpaRecord = async (req, res) => {
  if (req.body.MoeVer === true) {
    req.body.MoeVer = 1;
  } else if (req.body.MoeVer === false) {
    req.body.MoeVer = 0;
  }
  /* const rpaUpdateSchema = P_rpaUpdateSchema();
  const result = rpaUpdateSchema.validate(req.body, { abortEarly: false });
  if (result.error) {
    return res.status(400).json({ message: result.error.details });
  } */

  const rpaRecord = await update(
    "RPA",
    ["MoeVer"],
    [req.body.MoeVer],
    ["ApplicationID"],
    [req.body.ApplicationID]
  );
  if (rpaRecord.error) {
    res.status(400).json({ message: rpaRecord.error });
  } else {
    if (rpaRecord.affectedRows) {
      const updatedrpaRecords = await selectAll("rpa_view");
      res.status(201).json({
        message: "rpaRecord updated successfully!",
        info: updatedrpaRecords,
      });
    } else {
      res
        .status(404)
        .json({ message: "rpaRecord not found...", info: rpaRecord });
    }
  }
};

module.exports = {
  getAllrpaRecords,
  createNewrpaRecord,
  updaterpaRecord,
};
