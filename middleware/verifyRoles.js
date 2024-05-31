const verifyRoles = (allowedRole) => {
  return (req, res, next) => {
    if (!req?.UserAuth) return res.sendStatus(401);
    console.log(req.UserAuth);
    const result = req.UserAuth === allowedRole ? true : false;
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
