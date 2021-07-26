const express = require('express')
const teamController = require('../controller/teams')

const router = express.Router()

router.get('/', teamController.getTeams)

router.post('/add', teamController.postCreateTeam)

router.patch('/del-user', teamController.removeUserFromTeam)

router.patch('/add-user', teamController.addUserToTeam)

module.exports = router