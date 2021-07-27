const express = require('express')

const userAuthenticate = require('../controller/authentication')
const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.get('/users', isAuth, userAuthenticate.getAllUsers)
router.post('/signup', userAuthenticate.postSignup)
router.post('/login', userAuthenticate.postLogin)

module.exports = router