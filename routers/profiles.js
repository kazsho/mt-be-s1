const { Router } = require("express");
const profileController = require("../controllers/profiles");

const profileRouter = Router();

profileRouter.get("/", profileController.index);
profileRouter.get("/:id", profileController.show);
profileRouter.post("/login", profileController.login);
profileRouter.post("/", profileController.create);
profileRouter.patch("/:id", profileController.update);
profileRouter.delete("/:id", profileController.destroy);

module.exports = profileRouter;