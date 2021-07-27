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
            id: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String,
            email: String
        }
    ]
})

meetingSchema.methods.addAttendee = function (user) {
    const present = !!this.attendees.find(attendee => attendee.id === user.id)
    if (!present) {
        this.attendees.push(attendee)
        return this.save()
    }
    throw new Error('User already present')
}

meetingSchema.methods.removeAttendee = function (user) {
    const idx = !!this.attendees.findIndex(attendee => attendee.id === user.id)
    if (idx > -1) {
        this.attendees.splice(idx, 1)
        return this.save()
    }
    throw new Error('Attendee not found!')
}

module.exports = mongoose.model('Meeting', meetingSchema)