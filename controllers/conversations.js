const Conversation = require("../Models/Conversations");

async function index(req, res) {
    try {
        const conversations = await Conversation.getAll();
        res.status(200).json(conversations);
    } catch(e) {
        res.status(500).json({error: e.message})
    }
}

async function showUser (req, res) {
    try {
        let id = req.params.id;
        const conversations = await Conversation.getByUser(id);
        res.status(200).json(conversations)
    } catch(e) {
        res.status(404).json({error: e.message})
    }
}

async function show (req, res) {
    try {
        let id = req.params.id;
        const conversation = await Conversation.getOneById(id);
        res.status(200).json(conversation)
    } catch(e) {
        res.status(404).json({error: e.message})
    }
}

async function create (req, res) {
    try {
        const data = req.body;
        const newConversation = await Conversation.create(data);
        res.status(201).json(newConversation);
    } catch(e) {
        res.status(400).json({error: e.message});
    }
}

async function update (req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        const conversation = await Conversation.getOneById(id);
        const result = await conversation.update(data);
        res.status(200).json(result);
    } catch (e) {
        res.status(404).json({error: e.message})
    }
}

async function destroy (req, res) {
    try {
        const id = req.params.id;
        const conversation = await Conversation.getOneById(id);
        const result = await conversation.destroy();
        res.status(204).end();
    } catch (e) {
        res.status(404).json({error: e.message})
    }
};

module.exports={ index, showUser, show, create, update, destroy}