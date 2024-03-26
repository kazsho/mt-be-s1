const { Router } = require("express");
const conversationController = require("../controllers/conversations");

const conversationRouter = Router();

conversationRouter.get("/", conversationController.index);
conversationRouter.get("/:id", conversationController.show);
conversationRouter.post("/", conversationController.create);
conversationRouter.patch("/:id", conversationController.update);
conversationRouter.delete("/:id", conversationController.destroy);
conversationRouter.get("/user/:id", conversationController.showUser);

module.exports = conversationRouter;
