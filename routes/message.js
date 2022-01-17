const router = require("express").Router();
const messageController = require("../controllers/messageController");

router.get("/new", messageController.newMessageGet);

router.post("/new", messageController.newMessagePost);

router.get("/:id", messageController.messageDetailGet);

module.exports = router;
