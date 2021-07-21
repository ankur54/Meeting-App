const express = require('express')

const userAuthenticate = require('../controller/authentication')

const router = express.Router()

router.post('/signup', userAuthenticate.postSignup)
router.post('/login', userAuthenticate.postLogin)
router.post('/logout', userAuthenticate.postLogout)

module.exports = router