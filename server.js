const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const peerService = ExpressPeerServer(http, {
    debug: true
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.render('room');
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        // console.log('joined room');
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })
})

app.use('/peerjs', peerService);

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})