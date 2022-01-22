const Message = require("../models/Message");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");

exports.newMessageGet = (req, res, next) => {
	res.render("new-message-form", {
		title: "onlyFUN! | New Message",
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
				title: "onlyFUN! | New Message",
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

exports.messageDeleteGet = async (req, res, next) => {
	try {
		const msg = await Message.findById(req.params.id).populate("author");

		res.render("message-delete", {
			title: "onlyFUN! | Delete message",
			message: msg,
		});
	} catch (error) {
		return next(error);
	}
};

exports.messageDeletePost = async (req, res, next) => {
	try {
		await Message.findByIdAndDelete(req.body.id).then(
			res.redirect(req.user.url)
		);
	} catch (error) {
		return next(error);
	}
};
