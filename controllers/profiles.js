const bcrypt = require("bcrypt");

const Profile = require("../Models/Profiles");
const Token = require("../Models/Tokens");

async function index(req, res) {
  try {
    const profiles = await Profile.getAll();
    res.status(200).json(profiles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function show(req, res) {
  try {
    let id = req.params.id;
    const profile = await Profile.getOneById(id);
    res.status(200).json(profile);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function login(req, res) {
  const data = req.body;

  try {
    const profile = await Profile.getOneByEmail(data.email);
    const authenticated = await bcrypt.compare(
      data.password,
      profile["password"]
    );

    if (!authenticated) {
      throw new Error("Incorrect credentials.");
    } else {
      const token = await Token.create(profile.account_id);
      res.status(200).json({ authenticated: true, token: token.token });
    }
  } catch (e) {
    res.status(403).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    const data = req.body;
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    data["password"] = await bcrypt.hash(data["password"], salt);
    const newProfile = await Profile.create(data);
    res.status(201).json(newProfile);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    const profile = await Profile.getOneById(id);
    const result = await profile.update(data);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function destroy(req, res) {
  try {
    const id = req.params.id;
    const profile = await Profile.getOneById(id);
    const result = await profile.destroy();
    res.status(204).end();
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

module.exports = { index, show, login, create, update, destroy };
