const express = require('express')

const router = express.Router()

router.get('/', meetingController.getMeetings)

router.post('/add', meetingController.postCreateMeeting)

router.patch('/del-user', meetingController.removeUserFromMeeting)

router.patch('/add-user', meetingController.addUserToMeeting)

module.exports = router