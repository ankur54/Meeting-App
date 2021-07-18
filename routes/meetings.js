const express = require('express')

const meetingController = require('../controller/meeting')

const router = express.Router()

router.get('/', meetingController.getMeetings)

router.post('/add', meetingController.postAddMeeting)

router.post('/del-user', meetingController.removeUserFromMeeting)

router.post('/add-user', meetingController.addUserToMeeting)

router.post('/filter', meetingController.filterMeetings)

module.exports = router