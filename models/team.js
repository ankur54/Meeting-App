const mongoose = require('mongoose')
const userSchema = require('./user')

const Schema = mongoose.Schema

const teamSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    dateOfCreation: {
        type: Date,
        default: new Date()
    },
    description: String,
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

teamSchema.methods.addAttendee = function (attendeeId) {
    if (!this.members.includes(attendeeId.toString())) {
        this.members.push(attendeeId)
        return this.save()
    }
    throw new Error('User already present')
}

teamSchema.methods.removeAttendee = function (attendeeId) {
    const idx = this.members.indexOf(attendeeId)
    if (idx > -1) {
        this.members.splice(idx, 1)
        return this.save()
    }
    throw new Error('Attendee not found!')
}

module.exports = mongoose.model('Team', teamSchema)