const express = require('express')
const mongoose = require('mongoose')

const authRouter = require('./routes/auth')
const meetRouter = require('./routes/meetings')
const teamRouter = require('./routes/teams')

const MONGODB_URI = 'mongodb://localhost:27017/Calendar'

// initializing the middlewares
const app = express()

// using the middlewares

// middleware to get request json object
app.use(express.json())
// middleware to CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

// branching requests to respective routes
app.use('/auth', authRouter)
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
.then (server => {
    console.log('Server up on PORT: 8000')
    const io = require('./utils/socket-io').init( server );
    io.on('connection', _ => console.log('Socket client connected!'))
})
.catch (err => console.log(err))