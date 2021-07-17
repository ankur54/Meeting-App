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

module.exports = mongoose.model('User', userSchema);