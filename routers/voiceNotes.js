const { Router } = require("express");
const audiosController = require("../controllers/audios");

const audiosRouter = Router();

audiosRouter.get("/", audiosController.index);
audiosRouter.get("/:id", audiosController.show);
audiosRouter.post("/", audiosController.create);
audiosRouter.patch("/:id", audiosController.update);
audiosRouter.delete("/:id", audiosController.destroy);
audiosRouter.get("/user/:id", audiosController.showUser);

module.exports = audiosRouter;
