const express = require('express')

const router = express.Router()

router.get('/', meetingController.getMeetings)

router.post('/add', meetingController.postCreateMeeting)

router.post('/del-user', meetingController.removeUserFromMeeting)

router.post('/add-user', meetingController.addUserToMeeting)

module.exports = router