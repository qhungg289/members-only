const router = require("express").Router();
const userController = require("../controllers/userController");

router.use((req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/login");
	}
	next();
});

router.get("/:id", userController.userDetailGet);

router.get("/:id/member", userController.userMemberGet);

router.post("/:id/member", userController.userMemberPost);

router.get("/:id/edit", userController.userEditGet);

router.post("/:id/edit", userController.userEditPost);

router.get("/:id/admin", userController.userAdminGet);

router.post("/:id/admin", userController.userAdminPost);

module.exports = router;
