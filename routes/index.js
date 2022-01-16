const router = require("express").Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.homeGet);

router.get("/signup", indexController.signUpGet);

router.post("/signup", indexController.signUpPost);

module.exports = router;
