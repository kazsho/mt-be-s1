const Token = require("../Models/Token");
const authenticator = async (req, res, next) => {
  try {
    const userToken = req.headers.authorization;

    if (!userToken) {
      return res.status(401).json({ error: "you need token" });
    }
    const validToken = await Token.getOneByToken(userToken);
    if (!validToken) {
      throw new Error("Token is bad");
    }

    req.user = { id: validToken.userid, role: validToken.role };

    next();
  } catch (err) {
    console.error("Error in authenticator middleware:", err);
    res.status(403).json({ error: err.message });
  }
};

module.exports = authenticator;
