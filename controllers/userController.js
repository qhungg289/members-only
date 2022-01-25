const User = require("../models/User");
const Message = require("../models/Message");
const { check, validationResult } = require("express-validator");

exports.userDetailGet = async (req, res, next) => {
	try {
		const isLogIn = req.user && req.user._id == req.params.id;

		const user = await User.findById(req.params.id).populate("messages");

		res.render("user-detail", {
			user,
			isLogIn,
			title: `onlyFUN! | ${user.fullName}`,
		});
	} catch (error) {
		return next(error);
	}
};

exports.userMemberGet = (req, res, next) => {
	res.render("user-member", {
		title: `onlyFUN! | Become a member`,
		errors: [],
	});
};

exports.userMemberPost = [
	check("secret").exists().isLength({ min: 1 }).trim().escape(),
	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render("user-member", {
				title: `onlyFUN! | Become a member`,
				errors: errors.array(),
			});
		}

		try {
			const user = await User.findById(req.params.id);

			if (req.body.secret == "theodinproject") {
				user.isMember = true;
				await user.save().then(res.redirect(user.url));
			} else {
				return res.render("user-member", {
					title: `onlyFUN! | Become a member`,
					errors: [{ msg: "Secret key is incorrect" }],
				});
			}
		} catch (error) {
			return next(error);
		}
	},
];

exports.userEditGet = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);

		res.render("user-edit", {
			user,
			title: "onlyFUN! | Edit personal information",
			errors: [],
		});
	} catch (error) {
		return next(error);
	}
};

exports.userEditPost = [
	check("firstName").exists().isLength({ min: 1 }).trim().escape(),
	check("lastName").exists().isLength({ min: 1 }).trim().escape(),
	check("username").exists().isLength({ min: 1 }).trim().escape(),
	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render("user-edit", {
				user: req.body,
				title: "onlyFUN! | Edit personal information",
				errors: errors.array(),
			});
		}

		try {
			const user_tmp = await User.findOne({ username: req.body.username });

			if (user_tmp) {
				return res.render("user-edit", {
					user: req.body,
					title: "onlyFUN! | Edit personal information",
					errors: [{ msg: "Username already exist" }],
				});
			}

			const user = await User.findByIdAndUpdate(req.params.id, {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				username: req.body.username,
			});

			res.redirect(user.url);
		} catch (error) {
			return next(error);
		}
	},
];

exports.userAdminGet = async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (user.isAdmin) {
		const messages = await Message.find({}).populate("author");

		return res.render("admin-dashboard", {
			title: "onlyFUN | Admin dashboard",
			messages,
		});
	}

	res.render("user-admin", { title: "onlyFUN | Admin access", errors: [] });
};

exports.userAdminPost = [
	check("secret").exists().isLength({ min: 1 }).trim().escape(),
	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render("user-admin", {
				title: "onlyFUN | Admin access",
				errors: errors.array(),
			});
		}

		try {
			const user = await User.findById(req.params.id);

			if (req.body.secret == "theodinproject@admin") {
				user.isAdmin = true;
				user.save().then(res.redirect(user.url));
			} else {
				return res.render("user-admin", {
					title: "onlyFUN | Admin access",
					errors: [{ msg: "Secret key is incorrect" }],
				});
			}
		} catch (error) {
			return next(error);
		}
	},
];
