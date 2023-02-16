// Node server which will handle socket io connections
const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
    }
});

const users = {};

io.on('connection', socket => {
    // If any new user joins, let ther connected users in the server knows!
    // new-user-joined = user defined event
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    // If someone sends a message, broadcast it to other people
    // send = user defined event
    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] })
    });
    // If someone leaves the chat, let others know 
    // disconnect = built in event
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id])
        delete users[socket.id];
    });
})