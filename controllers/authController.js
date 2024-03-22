const bcrypt = require("bcrypt");

const User = require("../Models/auth");
const Token = require("../Models/Token");
async function register(req, res) {
  try {
    const data = req.body;

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    data["password"] = await bcrypt.hash(data.password, salt);

    const result = await User.create(data);
    res.status(201).send(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  const data = req.body;
  try {
    const user = await User.getOneByUsername(data.username);
    const authenticated = await bcrypt.compare(data.password, user.password);

    if (!authenticated) {
      throw new Error("Incorrect details");
    } else {
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);

      const token = await Token.create(user.id, expiration);

      res.status(200).json({ authenticated: true, token: token.token });
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
};
