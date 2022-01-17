const Message = require("../models/Message");
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

exports.homeGet = async (req, res, next) => {
	try {
		const messages = await Message.find({}).populate("author");

		res.render("index", { title: "Only Fun", messages });
	} catch (error) {
		return next(error);
	}
};

exports.signUpGet = (req, res, next) => {
	res.render("signup", {
		title: "Only Fun | Sign Up",
		errors: [],
		body: req.body,
	});
};

exports.signUpPost = [
	check("firstName").trim().escape(),
	check("lastName").trim().escape(),
	check("username").exists().isLength({ min: 4 }).trim().escape(),
	check("password").exists().isLength({ min: 4 }).trim().escape(),
	check("confirmPassword", "This must be the same as your password!")
		.exists()
		.isLength({ min: 4 })
		.custom((value, { req }) => value == req.body.password),
	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render("signup", {
				title: "Only Fun | Sign Up",
				errors: errors.array(),
				body: req.body,
			});
		}

		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);

			const user = await new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				username: req.body.username,
				password: hashedPassword,
			});

			await user.save().then(res.redirect("/login"));
		} catch (error) {
			return next(error);
		}
	},
];

exports.logInGet = (req, res, next) => {
	res.render("login", {
		title: "Only Fun | Log In",
		errors: [],
		body: req.body,
	});
};

exports.logInPost = [
	check("username").exists().isLength({ min: 4 }).trim().escape(),
	check("password").exists().isLength({ min: 4 }).trim().escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render("login", {
				title: "Only Fun | Log In",
				errors: errors.array(),
				body: req.body,
			});
		}

		next();
	},
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	}),
];

exports.logOutGet = (req, res, next) => {
	req.logout();
	res.redirect("/");
};
