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
        default: new Date(),
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true,
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
    this.meetings.push(meetingId)
    return this.save()
}

userSchema.methods.removeMeeting = function(meetingId) {
    const idx = this.meetings.indexOf(meetingId)
    if (idx > -1) {
        this.meetings.splice(idx, 1);
        return this.save()
    }
    throw new Error('Meeting was not found')
}

module.exports = mongoose.model('User', userSchema);