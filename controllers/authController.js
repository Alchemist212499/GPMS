const { findOne, save, findByColumn } = require("../config/db");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { UserID, UserPwd } = req.body;
  console.log(req.body);
  if (!UserID || !UserPwd)
    return res
      .status(400)
      .json({ message: "UserID and password are required" });

  const foundUser = await findByColumn("users", "userid", [UserID]);
  if (!foundUser) {
    console.log("Invalid User ID");
    return res.sendStatus(401);
  } //Unauthorized
  console.log("foundUser:", foundUser);

  console.log("Valid User ID");
  // evaluate password
  const match = await findByColumn("users", "userPwd", UserPwd);
  if (match) {
    console.log("Valid User Pwd");
    const UserAuth = foundUser.UserAuth;
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          UserID: foundUser.UserID,
          UserAuth: UserAuth,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { UserID: foundUser.UserID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    const result = await save("Users", "UserID", "RefreshToken", [
      refreshToken,
      22050208,
    ]);
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    }); // secure: true,
    res.json(foundUser);
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
