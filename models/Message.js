const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const messageSchema = new mongoose.Schema({
	author: { type: mongoose.Types.ObjectId, required: true },
	content: { type: String, required: true },
	createdAt: {
		type: String,
		default: () => DateTime.now().toLocaleString(DateTime.DATETIME_MED),
	},
});

messageSchema.virtual("url").get(function () {
	return `/message/${this._id}`;
});

module.exports = mongoose.model("Message", messageSchema);
