const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("Invalid authHeader");
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.UserID = decoded.UserInfo.UserID;
    req.UserAuth = decoded.UserInfo.UserAuth;
    next();
  });
};

module.exports = verifyJWT;
