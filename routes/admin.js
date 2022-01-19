const router = require("express").Router();

router.use((req, res, next) => {
	if (!req.user.isAdmin) {
		return res.redirect("/");
	}

	next();
});

router.get("/");

module.exports = router;
