const express = require('express')
const teamController = require('../controller/teams')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.get('/', isAuth, teamController.getTeams)

router.post('/add', isAuth, teamController.postCreateTeam)

router.patch('/del-user', isAuth, teamController.removeUserFromTeam)

router.patch('/add-user', isAuth, teamController.addUserToTeam)

module.exports = router