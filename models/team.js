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

module.exports = mongoose.Model('Team', teamSchema)