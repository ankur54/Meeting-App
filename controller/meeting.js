const User = require('../models/user')
const Meeting = require('../models/meeting')


const removeUserFromMeeting = async (req, res) => {
    try {
        const userEmail = req.body.email
        const meetingId = req.body.meetingId
    
        const user = await User.findOne({email: userEmail})
        const meeting = await Meeting.findById(meetingId)

        console.log(user._id, meeting._id)
    
        await meeting.removeAttendee(user._id)
        await user.removeMeeting(meeting._id)

        res.status(200).send({ message: 'Meeting edited successfully' })
    }
    catch (err) {
        res.status(404).send({ error: err.message })
    }
}

const addUserToMeeting = async (req, res) => {
    try {
        const userEmail = req.body.email
        const meetingId = req.body.meetingId
    
        const user = await User.findOne({email: userEmail})
        const meeting = await Meeting.findById(meetingId)
    
        await meeting.addAttendee(user._id)
        await user.addMeeting(meeting._id)

        res.status(200).send({ message: 'Meeting edited successfully' })
    }
    catch (err) {
        res.status(404).send({ error: err.message })
    }
}

const postCreateMeeting = async (req, res) => {
    try {
        if (!req.session.user) 
            return res.status(404).send({ message: 'No user selected' })
        
        const user = req.session.user
        const title = req.body.title
        const description = req.body.description
        const date = req.body.date
        const startTime = req.body.startTime
        const endTime = req.body.endTime
        let attendeesEmail = req.body.attendees
    
        // check if all attendees are valid
        // if valid --> replace with user object
        // [ TO DO ]: else --> show error
        attendeesEmail.push(user.email)
        attendeesEmail = attendeesEmail.filter((email, idx) => attendeesEmail.indexOf(email) === idx)
        const attendees = await User.find({email: { $in: attendeesEmail }})

        const attendeesId = attendees.map(attendee => attendee._id)
        const meeting = new Meeting({
            title,
            description,
            date,
            startTime,
            endTime,
            organizer: user._id,
            attendees: attendeesId
        })
        const savedMeeting = await meeting.save()
        attendees.forEach(attendee => attendee.addMeeting(savedMeeting._id))
        res.status(200).send({ message: 'Meeting created successfully' })
    }
    catch (err) {
        res.status(404).send({ error: err.message })
    }
}

const getMeetings = async (req, res) => {
    try {
        if (!req.session.user) 
            return res.status(404).send({ message: 'No user selected' })
        
        let user = req.session.user
        const date = req.query.date
        const startTime = req.query.startTime
        const endTime = req.query.endTime
        user = await User.populate(user, {
                                    path: 'meetings',
                                    match: { 
                                        date: date,
                                        startTime: { 
                                            $gte: startTime,
                                            $lte: endTime
                                        }
                                    }
                                })
        
        res.status(200).send(user.meetings)
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