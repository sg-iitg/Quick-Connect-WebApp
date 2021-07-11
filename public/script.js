const socket = io('/')
// the video grid holds all the video elements
const videoGrid = document.getElementById('video-grid')

// configure the STUN servers
let configuration = {
    'iceServers': [
        {
            "urls": ["stun:stun.l.google.com:19302", 
            "stun:stun1.l.google.com:19302", 
            "stun:stun2.l.google.com:19302"], 
        },
    ]
}

// setup the peer connection, pass the configs to it
const myPeer = new Peer(undefined, {
    config: configuration,
    path: '/peerjs',
    host: '/',
    port: '443'
})

// stores all the calls
let peers={}

// stores the connection stream
let currentPeer= []

// stores the userid and username mapping
// initialise it with the list of users who joined before the current user
let users_list = users_dict

//  stores the id of last person who texted
// helpul in grouping continuous text by same person together
let last_id =''

// stores current users' stream
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.setAttribute('onclick', 'zoomVideo(this)')

// so that we don't hear our own voice
myVideo.muted = true;


// get the audio and video
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {

    myVideoStream = stream;
    // add our video to the stream
    addVideoStream(myVideo, stream)

    // when someone calls us, answer the call by sending our stream and video element to them
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        video.setAttribute('onclick', 'zoomVideo(this)')

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        currentPeer.push(call.peerConnection);
        
        call.on('close', function(){
            video.remove();
            alert("The videocall has finished");
        });
    })

    // when user id connected
    // fetch username and userId and store in global variable
    socket.on('user-connected', (userId, users) => {
        users_list[Object.keys(users)[0]] = users[Object.keys(users)[0]]
        setTimeout(connectToNewUser,1000,userId,stream)
    })

    // get the text element in chat input box
    let text = $("input");
    // when press enter send message
    $('html').keydown(function (e) {
        //  whenever enter is pressed and text is not empty
        // emit the message
        // and empty the chat input box
        if (e.which == 13 && text.val().length !== 0) {

          // encrypt the messages before sending to server 
          let encrypted = CryptoJS.AES.encrypt(text.val(), '9740').toString();
          socket.emit('message', encrypted);
          text.val('')
        }
    });

    socket.on("createMessage", (message, id) => {
        // decrypt the encrypted messages before displaying
        message = CryptoJS.AES.decrypt(message, '9740').toString(CryptoJS.enc.Utf8);
        
        let username = users_list[id]
        // if mssg is by same person as last time, do not put username
        if(last_id==id) {
            $(".messages").append(`<li class="message">${message}</li>`);
        }
        else {
            $(".messages").append(`<li class="message"><b>`+username+`</b><br/>${message}</li>`);
        }
        // update the last id
        last_id= id
        scrollToBottom()
    })
})

// whenver a user disconnects, delete him from the list and alert in all other rooms
// also remove his stream
socket.on('user-disconnected', userId => {
    alert(users_list[userId] + " left!")

    if(users_list[userId]) {
        delete users_list[userId]
    }

    if (peers[userId]) {
        peers[userId].close()
    }
})

// whenever a peer connection is established, save the userId with username - you
// emit that a room with this roomId and userId has been created
myPeer.on('open', id => {
    users_list[id]= "You"
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    video.setAttribute('onclick', 'zoomVideo(this)')

    // add the stream of new user
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    // remove his video, when he leaves
    call.on('close', () => {
        video.remove()
    })
    // save the stream, will be required when user disconnects
    peers[userId] = call

    currentPeer.push(call.peerConnection);
}

// set the source of this video element to stream,
// append to video-grid
function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

//screenShare
function screenShare() {
    // get the screen media
    navigator.mediaDevices.getDisplayMedia({ 
        video: {
          cursor:'always'
        },
        audio: {
               echoCancellation:true,
               noiseSupprission:true
        }   
    }).then(stream => {
        let element = $('#screen-share').attr("style", "background-color: #565656;")
        let videoTrack = stream.getVideoTracks()[0];

        // if stream has ended, call stopStream
        videoTrack.onended = function() {
            stopScreenShare();
        }

        // get all the users to which this user is connected to, 
        // and replace his video stream with the screen stream for everyone
        for (let user=0; user<currentPeer.length; user++) {
            let sender = currentPeer[user].getSenders().find(function(s) {
                return s.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack);
        }
    })
}
   
function stopScreenShare() {
    let element = $('#screen-share').attr("style", "")
    // get all the users to which this user is connected to, 
    // and replace his screen stream with the video stream for everyone
    let videoTrack = myVideoStream.getVideoTracks()[0];

    for (let user=0; user<currentPeer.length; user++){
        let sender = currentPeer[user].getSenders().find(function(s){
            return s.track.kind == videoTrack.kind;
        }) 
        sender.replaceTrack(videoTrack);
    }       
}

$('document').ready(function(){
    // as soon as we enter to the room, fill in previous chat if any
    let num_of_mssgs = previous_mssgs.length;
    let last_mssg_id=''
    for(let i=0; i<num_of_mssgs; i++)
    {
        let by_id = previous_mssgs[i]['id']
        let username = previous_mssgs[i]['name']
        let mssg = previous_mssgs[i]['message']

        // decrypt the encrypted messages before displaying
        mssg = CryptoJS.AES.decrypt(mssg, '9740').toString(CryptoJS.enc.Utf8);

        // if mssg is by same person as last time, do not put username
        if(last_mssg_id==by_id) {
            $(".messages").append(`<li class="message">${mssg}</li>`);
        }
        else {
            $(".messages").append(`<li class="message"><b>${username}</b><br/>${mssg}</li>`);
        }
        // update the last id
        last_mssg_id= by_id
        scrollToBottom()
    }
    // update the global last id as well
    // needed for fresh chats
    last_id = last_mssg_id
})