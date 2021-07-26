const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1]
    let decodedToken = null
    try {
        decodedToken = jwt.verify(token, 'thisismysuperlongsecretkey')
    }
    catch (err) {
        err.statusCode = 500
        throw err
    }

    if (!decodedToken) {
        const err = new Error('Not Authenticated')
        err.statusCode = 401
        throw err
    }
    
    req.userId = decodedToken.id
    next()
}