const User = require("../models/User");

exports.userDetailGet = async (req, res, next) => {
	try {
		if (!req.isAuthenticated()) {
			return res.redirect("/login");
		}

		let isLogIn = req.user && req.user._id == req.params.id;

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
