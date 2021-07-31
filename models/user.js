const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    dateOfJoining: {
        type: Date,
        default: new Date()
    },
    meetings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Meeting'
        }
    ],
    teams: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Team'
        }
    ]
})

userSchema.methods.addMeeting = function(meetingId) {
    console.log(`Adding meeting ${meetingId} to user ${this.name}`)
    if (!this.meetings.includes(meetingId.toString())) {
        this.meetings.push(meetingId)
        return this.save()
    }
    throw new Error('Meeting already added')
}

userSchema.methods.removeMeeting = function(meetingId) {
    this.meetings = this.meetings.filter(
		(meeting) => meeting._id.toString() !== meetingId.toString()
    );
    return this.save()
}

module.exports = mongoose.model('User', userSchema);