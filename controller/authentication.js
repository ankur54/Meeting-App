const User = require('../models/user')


const postLogin = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.find({ 
        email: email, 
        password: password
    })
    .exec()
    .then(result => console.log(result))
    .catch(err => console.log(err))
}

const postSignup = (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const dateOfBirth = req.body.dateOfBirth
    const department = req.body.department

    User.find({ email: email, name: name })
        .then(result => {
            if (result.length > 0) 
                res.send({ message: 'User already exists!' })
            
            else {
                const user = new User({
                    name, 
                    email, 
                    password, 
                    dateOfBirth, 
                    department
                })
                return user.save()
            }
        })
        .then(result => {
            console.log("User created SUCCESSFULLY!")
            res.send(result)
        })
        .catch (err => console.log(err))

}

module.exports = {
    postSignup,
    postLogin
}