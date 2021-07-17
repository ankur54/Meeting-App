const express = require('express')

const userAuthenticate = require('../controller/authentication')

const router = express.Router()

router.post('/login', userAuthenticate.postLogin)
router.post('/signup', userAuthenticate.postSignup)

module.exports = router