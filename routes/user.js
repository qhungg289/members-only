const router = require("express").Router();
const userController = require("../controllers/userController");

router.get("/:id", userController.userDetailGet);

module.exports = router;
