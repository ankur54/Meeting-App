let io;

module.exports = {
    init: function( httpServer ) {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization']
            }
        })
        return io
    },
    getIO: function() {
        if (!io) throw new Error('No IO Socket were initialized!')
        return io
    }
}