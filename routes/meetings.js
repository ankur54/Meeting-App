const express = require('express')

const meetingController = require('../controller/meeting')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.get('/', isAuth, meetingController.getMeetings)

router.post('/add', isAuth, meetingController.postCreateMeeting)

router.patch('/del-user', isAuth, meetingController.removeUserFromMeeting)

router.patch('/add-user', isAuth, meetingController.addUserToMeeting)

router.get('/filter', isAuth, meetingController.filterMeetings)

module.exports = router