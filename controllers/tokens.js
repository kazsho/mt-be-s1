const Token = require("../Models/Tokens");

async function index(req, res) {
    try {
        const tokens = await Token.getAll();
        res.status(200).json(tokens);
    } catch(e) {
        res.status(500).json({error: e.message})
    }
}

async function show (req, res) {
    try {
        let token = req.params.token;
        console.log("token:  "+token)
        const tokenId = await Token.getOneByToken(token);
        console.log("token entry: "+tokenId)
        res.status(200).json(tokenId)
    } catch(e) {
        res.status(404).json({error: e.message})
    }
}

async function create (req, res) {
    try {
        const id = req.params.id;
        const newToken = await Token.create(id);
        res.status(201).json(newToken);
    } catch(e) {
        res.status(400).json({error: e.message});
    }
}

async function destroy (req, res) {
    try {
        console.log("start")
        const tokenCode = req.params.token;
        const token = await Token.getOneByToken(tokenCode);
        console.log("almost"+tokenCode)
        const result = await token.destroy(tokenCode);
        res.status(204).end();
    } catch (e) {
        res.status(404).json({error: e.message})
    }
};

module.exports={ index, show, create, destroy }