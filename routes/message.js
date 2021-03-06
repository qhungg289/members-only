const router = require("express").Router();
const messageController = require("../controllers/messageController");

router.use("/new", (req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/login");
	}
	next();
});

router.get("/new", messageController.newMessageGet);

router.post("/new", messageController.newMessagePost);

router.get("/:id/delete", messageController.messageDeleteGet);

router.post("/:id/delete", messageController.messageDeletePost);

module.exports = router;
