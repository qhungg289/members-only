const Message = require("../models/Message");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");

exports.newMessageGet = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/login");
	}

	res.render("new-message-form", {
		title: "Only Fun | New Message",
		errors: [],
		body: req.body,
	});
};

exports.newMessagePost = [
	check("message").exists().trim().escape(),
	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render("new-message-form", {
				title: "Only Fun | New Message",
				errors: errors.array(),
				body: req.body,
			});
		}

		try {
			const msg = await new Message({
				author: req.user._id,
				content: req.body.message,
			});
			const user = await User.findById(req.user._id);

			await msg
				.save()
				.then(user.messages.push(msg._id))
				.then(await user.save())
				.then(res.redirect("/"));
		} catch (error) {
			return next(error);
		}
	},
];

exports.messageDetailGet = async (req, res, next) => {};
