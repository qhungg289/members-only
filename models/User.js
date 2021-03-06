const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	isMember: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false },
	username: { type: String, required: true },
	password: { type: String, required: true },
	messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
});

userSchema.virtual("url").get(function () {
	return `/user/${this._id}`;
});

userSchema.virtual("avatar").get(function () {
	return `https://avatars.dicebear.com/api/initials/${this.firstName}-${this.lastName}.svg`;
});

userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);
