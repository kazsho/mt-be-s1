const { Router } = require("express");
const tokenController = require("../controllers/tokens");

const tokenRouter = Router();

tokenRouter.get("/", tokenController.index);
tokenRouter.get("/:token", tokenController.show);
tokenRouter.post("/", tokenController.create);
tokenRouter.delete("/:token", tokenController.destroy);

module.exports = tokenRouter;