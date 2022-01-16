const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

function initPassport(passport) {
	passport.use(
		new LocalStrategy(async (username, password, done) => {
			try {
				const user = await User.findOne({ username: username });

				if (!user) {
					return done(null, false, { message: "Incorrect username" });
				}

				if (!(await bcrypt.compare(password, user.password))) {
					return done(null, false, { message: "Incorrect password" });
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	});
}

module.exports = initPassport;
