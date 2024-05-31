const { findByColumn, selectAll, selectByColumn } = require("../config/db");

const getAllUsers = async (req, res) => {
  const users = await selectAll("vw_users_res");
  if (!users) {
    return res.status(204).json({ message: "No users found" });
  }
  res.json(users);
};

const getUser = async (req, res) => {
  const { UserID } = req.body;
  if (!UserID) {
    return res.status(400).json({ message: "User ID Required." });
  }
  const user = await findByColumn("vw_users_res", "userid", UserID);

  if (!user.length) {
    return res.status(204).json({ message: `No user matches ID ${UserID}` });
  }
  res.json(user);
};

module.exports = {
  getAllUsers,
  getUser,
};
