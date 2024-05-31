const { selectAll } = require("../config/db");

const getAllrpsRecords = async (req, res) => {
  const rpsRecords = await selectAll("rps_view");
  console.log("rpsRecords>", rpsRecords);
  if (!rpsRecords.length) {
    return res.status(204).json({ message: "No rps Records found" });
  }
  res.json({ message: "rpsRecords fetched!", info: rpsRecords });
};

module.exports = { getAllrpsRecords };
