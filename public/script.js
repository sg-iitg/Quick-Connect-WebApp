const socket = io('/')
const videoGrid = document.getElementById('video-grid')

const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})

let peers={}
let users_list = users_dict
let last_username =''

let myVideoStream;
const myVideo = document.createElement('video')
// so that we don't hear our own voice
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId, users) => {
    users_list[Object.keys(users)[0]] = users[Object.keys(users)[0]]
    setTimeout(connectToNewUser,1000,userId,stream)
  })

  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });

  socket.on("createMessage", (message, id) => {
    let username = users_list[id]
    if(last_username==username)
    {
      $(".messages").append(`<li class="message">${message}</li>`);
    }
    else
    {
      $(".messages").append(`<li class="message"><b>`+username+`</b><br/>${message}</li>`);
    }
    last_username= username
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  alert(users_list[userId] + " left!")
  delete users_list[userId]
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  users_list[id]= "You"
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {

  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')

  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>`
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`
  document.querySelector('.main__video_button').innerHTML = html;
}

function showParticipantList()
{
  let n = users_list.length;

  let list = document.getElementById("participants-list-show");
  list.innerHTML='';
  
  for (const [key, value] of Object.entries(users_list)) 
  {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(value));
    list.appendChild(li);
  }
}

function sendInvite()
{
  let div= document.getElementById('invite_message');
  let mssg = "Hey! Let's connect over a video chat. Here is the website link: https://boxing-poppy-43327.herokuapp.com/. When prompted, enter this roomId: " +ROOM_ID;
  div.innerHTML= mssg;    
}

function copyInviteMessage()
{
  $("#invite_message").select();
    document.execCommand('copy');
}