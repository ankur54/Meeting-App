const express = require('express')
const mongoose = require('mongoose')

const authRouter = require('./routes/auth')
const meetRouter = require('./routes/meetings')
const User = require('./models/user')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

// dummy way to set user for now --> need to change to session set user
app.use((req, res, next) => {
    User.findOne()
        .then(user => {
            if (user) {
                req.user = user
                next()
            }
            else throw 'No user found!'
        })
        .catch(err => console.log(err))
})

app.use(authRouter)
app.use(meetRouter)

mongoose.connect('mongodb://localhost:27017/Calendar', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(connection => {
    console.log('Database Connected!')
    return app.listen('8000')
})
.then (response => console.log('Server up on PORT: 8000'))
.catch (err => console.log(err))