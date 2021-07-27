const User = require('../models/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const postSignup = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
    
        const existingUser = await User.findOne({ email: email, name: name })
        if (existingUser) return res.status(400).json({ message: 'User already exists!' })
    
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = new User({
            name, 
            email, 
            password: hashedPassword
        })
    
        const savedUser = await newUser.save()
        return res.status(201).send(savedUser)
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

const postLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
    
        const existingUser = await User.findOne({ email: email })
        if (!existingUser) throw new Error ('No user with such email exists!')

        const doMatch = await bcrypt.compare(password, existingUser.password)
        if (doMatch) {
            const token = jwt.sign({
                email,
                id: existingUser._id.toString()
            }, 'thisismysuperlongsecretkey',
            { expiresIn: '1h' }
            )

            return res.status(201).json({
                token,
                userId: existingUser._id.toString(),
                userName: existingUser.name,
                userEmail: existingUser.email
            })
        }
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

module.exports = {
    postSignup,
    postLogin
}