const mongoose = require('mongoose')
const userSchema = require('./user')

const Schema = mongoose.Schema

const meetingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    description: String,
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    attendees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

meetingSchema.methods.addAttendee = function (attendeeId) {
    this.attendees.push(attendeeId)
    return this.save()
}

meetingSchema.methods.removeAttendee = function (attendeeId) {
    const idx = this.attendees.indexOf(attendeeId)
    if (idx > -1) {
        this.attendees.splice(idx, 1)
        return this.save()
    }
    throw new Error('Attendee not found!')
}

module.exports = mongoose.model('Meeting', meetingSchema)