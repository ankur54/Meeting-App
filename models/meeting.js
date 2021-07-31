const mongoose = require("mongoose");
const userSchema = require("./user");

const Schema = mongoose.Schema;

const meetingSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	startTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
	description: String,
	organizer: {
		id: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		name: String,
		email: String
	},
	attendees: [
		{
			id: {
				type: Schema.Types.ObjectId,
				ref: "User",
			},
			name: String,
			email: String,
		},
	],
});

meetingSchema.methods.addAttendee = function (user) {
	const present = !!this.attendees.find(
		(attendee) => attendee._id.toString() === user._id.toString()
	);
	if (!present) {
		this.attendees.push(user);
		console.log(this.attendees);
		return this.save();
	}
	throw new Error("User already present");
};

meetingSchema.methods.removeAttendee = function (userId) {
	// throw new Error("Attendee not found!");
	this.attendees = this.attendees.filter(
		(attendee) => attendee._id.toString() !== userId.toString()
	);
	return this.save();
};

module.exports = mongoose.model("Meeting", meetingSchema);
