const User = require('../models/user')
const Team = require('../models/team')


const removeUserFromTeam = async (req, res) => {
    try {
        const userEmail = req.body.email
        const teamId = req.body.teamId
    
        const user = await User.findOne({email: userEmail})
        const team = await Team.findById(teamId)

        console.log(user._id, team._id)
    
        await team.removeAttendee(user._id)
        await user.removeTeam(team._id)

        res.status(200).send({ message: 'Team edited successfully' })
    }
    catch (err) {
        res.status(404).send({ error: err.message })
    }
}

const addUserToTeam = async (req, res) => {
    try {
        const userEmail = req.body.email
        const teamId = req.body.teamId
    
        const user = await User.findOne({email: userEmail})
        const team = await Team.findById(teamId)
    
        await team.addAttendee(user._id)
        await user.addTeam(team._id)

        res.status(200).send({ message: 'Team edited successfully' })
    }
    catch (err) {
        res.status(404).send({ error: err.message })
    }
}

const postCreateTeam = async (req, res) => {
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
        const team = new Team({
            title,
            description,
            date,
            startTime,
            endTime,
            organizer: user._id,
            attendees: attendeesId
        })
        const savedTeam = await team.save()
        attendees.forEach(attendee => attendee.addTeam(savedTeam._id))
        res.status(200).send({ message: 'Team created successfully' })
    }
    catch (err) {
        res.status(404).send({ error: err.message })
    }
}

const getTeams = async (req, res) => {
    try {
        if (!req.session.user) 
            return res.status(404).send({ message: 'No user selected' })
        
        let user = req.session.user
        const date = req.query.date
        const startTime = req.query.startTime
        const endTime = req.query.endTime
        user = await User.populate(user, {
                                    path: 'teams',
                                    match: { 
                                        date: date,
                                        startTime: { 
                                            $gte: startTime,
                                            $lte: endTime
                                        }
                                    }
                                })
        
        res.status(200).send(user.teams)
    }
    catch(err) {
        res.status(404).send({ error: err.message })
    }
}

module.exports = {
    removeUserFromTeam,
    addUserToTeam,
    postCreateTeam,
    getTeams
}