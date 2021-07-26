const express = require('express')

const meetingController = require('../controller/meeting')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.get('/', meetingController.getMeetings)

router.post('/add', meetingController.postCreateMeeting)

router.patch('/del-user', meetingController.removeUserFromMeeting)

router.patch('/add-user', meetingController.addUserToMeeting)

router.get('/filter', isAuth, meetingController.filterMeetings)

module.exports = router