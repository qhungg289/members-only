const router = require("express").Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.homeGet);

router.get("/signup", indexController.signUpGet);

router.post("/signup", indexController.signUpPost);

router.get("/login", indexController.logInGet);

router.post("/login", indexController.logInPost);

router.get("/logout", indexController.logOutGet);

module.exports = router;
