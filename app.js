const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)

const authRouter = require('./routes/auth')
const meetRouter = require('./routes/meetings')
const teamRouter = require('./routes/teams')

const MONGODB_URI = 'mongodb://localhost:27017/Calendar'

// initializing the middlewares
const app = express()
const store = mongoDBStore({
    uri: MONGODB_URI,
    collection: 'session'
})
const expressSession = session({
    secret: 'doreamon',
    resave: false,
    saveUninitialized: false,
    store: store,
})


// using the middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(expressSession)

// branching requests to respective routes
app.use(authRouter)
app.use("/meeting", meetRouter)
app.use("/team", teamRouter)

// connect mongodb server using mongoose and start listening on port 8000
mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(connection => {
    console.log('Database Connected!')
    return app.listen('8000')
})
.then (response => console.log('Server up on PORT: 8000'))
.catch (err => console.log(err))