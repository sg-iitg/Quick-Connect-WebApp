const express = require('express')
const path = require('path');

// required for parsing post requests from frotend
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: true })); 

// setup http server
const server = require('http').Server(app)
// require socket.io and pass our server
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

// this is used to generate random room ids
const { v4: uuidV4 } = require('uuid');
const { json } = require('body-parser');

// setup the peer server path, view engine and the folder where all js and css files will be found
app.use('/peerjs', peerServer);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))

// global variable which is used to store the mapping of userIds with usernames 
// users = {roomid: {userId : username}}
// that is a dictionary whose values are also dictionaries
let users = {}
let username = ""

// this post request is recieved when someone clicks on the Start meeting button
// get the username from frontend 
// send the user to a randomly generated roomId craeted using uuid
app.post('/room', (req, res) => {
    username = req.body.username_start_user
    res.redirect(`/${uuidV4()}`)
});

// this post request is recieved when someone clicks on the join meeting button
// get the username from frontend 
// and redirect to that room
app.post('/join', (req, res) => {
    username = req.body.username_join_user
    res.redirect(`/${req.body.roomid}`)
});

// this renders the leave meeting page 
app.get('/leave', (req, res) => {
    res.render('leave')
});

// render homepage for joining
app.get('/join', (req, res) => {
    res.render('homepage-join')
})

// render homepage for starting
app.get('/', (req, res) => {
    res.render('homepage-start')
})

// render the particular room by roomId
app.get('/:room', (req, res) => {
    // if username is blank, this is the case when someone tries to join a meet without visiting the homepage
    // redirect to homepage
    if(!username) {
        res.render('homepage-start', {layout:false})
    }
    else {
        // send the room id and the list of users already in that room
        let roomid = req.params.room
        let dict ={}
        if(roomid in users) {
          dict = users[roomid]
        }
        else {
          dict= {}
        }
        res.render('meeting-area', { roomId: req.params.room, users: dict}) 
    }
})

// all socket scripts go here
io.on('connection', socket => {
  
    // when someone joins room with a particular roomId and userId 
    socket.on('join-room', (roomId, userId) => {

        // save his username in this room's users list
        if(!(roomId in users)) {
            users[roomId]= {}
        }
        let dict ={}
        dict[userId] = username

        users[roomId][userId]= username
        username = ""

        // join the room
        socket.join(roomId)

        // broadcast to evryone that this user has joined
        // dict sends the userId and username for this user
        socket.to(roomId).broadcast.emit('user-connected', userId, dict);

        // this is for chat feature
        socket.on('message', (message) => {
            //send message to the same room, and pass who is sending the message
            io.to(roomId).emit('createMessage', message, userId)
        })

        // when someone disconnects, remove their userId from this room's participant list
        socket.on('disconnect', () => {
            delete users[roomId][userId]
            // broadcast to everyone that user left
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT||3030)