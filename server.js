const express = require('express')

// required for parsing post requests from frotend
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: true })); 

// setup http server
const server = require('http').Server(app)
// require socketio and pass our server
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

// this is used to generate random room ids
const { v4: uuidV4 } = require('uuid');
const { json } = require('body-parser');

app.use('/peerjs', peerServer);
app.set('view engine', 'ejs')
app.use(express.static('public'))

let users = {}
let username = ''

// get the username from frontend and redirect to a new room
app.get('/leave', (req, res) => {
  res.render('leave')
});

// render homepage
app.get('/', (req, res) => {
  res.render('homepage')
})

// get the username from frontend and redirect to a new room
app.post('/room', (req, res) => {
  username = req.body.username_start_user
  res.redirect(`/${uuidV4()}`)
});

// get the username from frontend and redirect to a that room
app.post('/join', (req, res) => {
  username = req.body.username_join_user
  res.redirect(`/${req.body.roomid}`)
});

// render the room, and send the roomId
app.get('/:room', (req, res) => {
  if(username=='')
  {
    res.redirect('/')
  }
  else
  {
    let roomid = req.params.room
    let dict ={}
    if(roomid in users)
    {
      dict = users[roomid]
    }
    else{
      dict= []
    }
    res.render('room', { roomId: req.params.room, users: dict}) 
  }
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    if(!(roomId in users))
    {
      users[roomId]= {}
    }
    let dict ={}
    dict[userId] = username

    users[roomId][userId]= username
    username = ''
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId, dict);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message, userId)
  }); 

  socket.on('disconnect', () => {
    delete users[roomId][userId]
    socket.to(roomId).broadcast.emit('user-disconnected', userId)
  })
  })
})

server.listen(process.env.PORT||3030)