const express = require('express')

const userAuthenticate = require('../controller/authentication')

const router = express.Router()

router.post('/signup', userAuthenticate.postSignup)
router.post('/login', userAuthenticate.postLogin)

module.exports = router