const { findOne } = require("../config/db");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await findOne("users", "RefreshToken", refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.UserID !== decoded.UserID) return res.sendStatus(403);
    const UserAuth = foundUser.UserAuth;

    const accessToken = jwt.sign(
      {
        UserInfo: {
          UserID: decoded.UserID,
          UserAuth: UserAuth,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
