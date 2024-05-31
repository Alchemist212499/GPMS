const { findOne } = require("../config/db");

async function handleLogin(req, res) {
  const { UserID, UserPwd } = req.body;
  if (!UserID || !UserPwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  try {
    const validUser = await findOne("users", "userid", UserID);
    const validPwd = await findOne("users", "userPwd", UserPwd);
    if (validUser.length && validPwd.length) {
      res.status(200).json({ message: "User Found!", validUser: validUser[0] });
      console.log({ message: "User Found!", validUser: validUser[0] });
    } else {
      res.status(404).json({ message: "User Not Found..." });
      console.log({ message: "User Not Found..." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { handleLogin };
