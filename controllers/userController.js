const User = require("../models/User");
const { check, validationResult } = require("express-validator");

exports.userDetailGet = async (req, res, next) => {
	try {
		const isLogIn = req.user && req.user._id == req.params.id;

		const user = await User.findById(req.params.id).populate("messages");

		res.render("user-detail", {
			user,
			isLogIn,
			title: `Only Fun | ${user.fullName}`,
		});
	} catch (error) {
		return next(error);
	}
};

exports.userMemberGet = (req, res, next) => {
	if (!(req.user && req.user._id == req.params.id)) {
		return res.redirect("/login");
	}

	res.render("user-member", {
		title: `Only Fun | Become a member`,
		errors: [],
	});
};

exports.userMemberPost = [
	check("secret").exists().trim().escape(),
	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render("user-member", {
				title: `Only Fun | Become a member`,
				errors: errors.array(),
			});
		}

		try {
			const user = await User.findById(req.params.id);

			if (req.body.secret == "theodinproject") {
				user.isMember = true;
				await user.save().then(res.redirect(user.url));
			} else {
				res.render("user-member", {
					title: `Only Fun | Become a member`,
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
			title: "Only Fun | Edit personal information",
			errors: [],
		});
	} catch (error) {
		return next(error);
	}
};

exports.userEditPost = [
	check("firstName").exists().isLength({ min: 1 }).trim().escape(),
	check("lastName").exists().isLength({ min: 1 }).trim().escape(),
	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render("user-edit", {
				user,
				title: "Only Fun | Edit personal information",
				errors: errors.array(),
			});
		}

		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
			});

			res.redirect(user.url);
		} catch (error) {
			return next(error);
		}
	},
];
