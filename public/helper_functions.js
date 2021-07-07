// if audio is on mute, onclick unmute and set the appropriate icon and vice versa
function muteUnmute() {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    let html;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        html = `<i class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`;
    } 
    else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        html = `<i class="fas fa-microphone"></i><span>Mute</span>`;
    }
    document.querySelector('.main__mute_button').innerHTML = html;
}
  
// if video is off/stop, onclick enable/play it and set the appropriate icon and vice versa
function playStop() {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    let html;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        html = `<i class="stop fas fa-video-slash"></i><span>Play Video</span>`;
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        html = `<i class="fas fa-video"></i><span>Stop Video</span>`;
    }
    document.querySelector('.main__video_button').innerHTML = html;
}
  
// get the current list of participants, stored in users_list
function showParticipantList() {
    let n = users_list.length;

    // get the ul element which stores the list
    let list = document.getElementById("participants-list-show");
    list.innerHTML='';

    // and refill it
    for (const [key, value] of Object.entries(users_list)) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(value));
        list.appendChild(li);
    }
}

// fill the invite mssg
function sendInvite() {
    let div= document.getElementById('invite_message');
    let mssg = "Hey! Let's connect over a video chat. Here is the website link: https://boxing-poppy-43327.herokuapp.com/. When prompted, enter this roomId: " +ROOM_ID;
    div.innerHTML= mssg;    
}
  
// on click of copy button, copy the invite
function copyInviteMessage() {
    $("#invite_message").select();
    document.execCommand('copy');
}
  
// on click of send icon in chat window, emit the message
function sendMessageButton() {
    let txt= document.getElementById('chat_message');
    if(txt.value.length !== 0) {
        socket.emit('message', txt.value);
        txt.value = ''
    }
}

// helpful when chat window is full upto the visible height
// makes sure we remain at the bottom of the window 
function scrollToBottom() {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}