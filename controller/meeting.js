const User = require('../models/user')
const Meeting = require('../models/meeting')
const io = require('../utils/socket-io')


const removeUserFromMeeting = async (req, res) => {
    try {
        const userEmail = req.body.email
        const meetingId = req.params.meetingId
    
        let user = await User.findOne({email: userEmail})
        let meeting = await Meeting.findById(meetingId)
    
        meeting = await meeting.removeAttendee(user._id)
        user = await user.removeMeeting(meetingId)

        io.getIO().emit('meetings', { action: 'REMOVE USER', meeting, user })
        res.status(200).send({ message: 'Meeting edited successfully' })
    }
    catch (err) {
        res.status(404).send({ error: err.message })
    }
}

const addUserToMeeting = async (req, res) => {
    try {
        const userEmail = req.body.email
        const meetingId = req.params.meetingId
    
        let user = await User.findOne({ email: userEmail })
        let meeting = await Meeting.findById(meetingId)
    
        meeting = await meeting.addAttendee(user)
        user = await user.addMeeting(meeting._id)
        
        io.getIO().emit('meetings', { action: 'ADD USER', meeting, user })
        res.status(204).send({ message: 'Meeting edited successfully' })
    }
    catch (err) {
        res.status(400).send({ error: err.message })
    }
}

const postCreateMeeting = async (req, res) => {
    try {
        const organizer = await User.findById(req.userId)
        const title = req.body.title
        const description = req.body.description
        const date = req.body.date
        const startTime = req.body.startTime
        const endTime = req.body.endTime
        let attendeesEmail = req.body.attendees
    
        // check if all attendees are valid
        // if valid --> replace with user object
        // [ TO DO ]: else --> show error
        attendeesEmail.push(organizer.email)
        attendeesEmail = attendeesEmail.filter((email, idx) => attendeesEmail.indexOf(email) === idx)
        const attendees = await User.find({email: { $in: attendeesEmail }})

        const meeting = new Meeting({
            title,
            description,
            date,
            startTime,
            endTime,
            organizer,
            attendees
        })
        const savedMeeting = await meeting.save()
        attendees.forEach(attendee => attendee.addMeeting(savedMeeting._id))
        io.getIO().emit('meetings', { action: 'CREATE', meeting: savedMeeting })
        res.status(200).send({ message: 'Meeting created successfully' })
    }
    catch (err) {
        res.status(404).json({ error: err.message })
    }
}

const getMeetings = async (req, res) => {
    try {
        const date = req.query.date
        const startTime = req.query.startTime || '00:00'
        const endTime = req.query.endTime || '23:59'

        const user = await User.findById(req.userId)
                                .populate({
                                    path: 'meetings',
                                    match: { 
                                        date: date,
                                        startTime: { 
                                            $gte: startTime,
                                            $lte: endTime
                                        }
                                    },
                                })
        res.status(200).json(user.meetings)
    }
    catch(err) {
        res.status(404).send({ error: err.message })
    }
}

const filterMeetings = async (req, res) => {
    try {
        const phrase = req.query.phrase
        const userId = req.userId

        const full_user = await User.findById(userId).populate({
            path: 'meetings',
            match: {
                $or: [
                    { "title": { $regex: phrase, $options: 'i' } },
                    { "description": { $regex: phrase, $options: 'i' } }
                ]
            }
        })

        res.status(200).send(full_user.meetings)
    }
    catch (err) {
        res.status(404).send({ error: err.message })
    }
}

module.exports = {
    removeUserFromMeeting,
    addUserToMeeting,
    postCreateMeeting,
    getMeetings,
    filterMeetings
}