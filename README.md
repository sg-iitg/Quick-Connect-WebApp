# Quick Connect Web Application

# [Video Demonstration](https://youtube.com)

## About The Website

This is a web application made using Node.js. This uses Socket.IO and PeerJS libraries to establish peer to peer connection. It allows group video and audio chat along with several other functionalities. I made this project as part of my submission for Microsoft Engage 2021. This was made as an attempt to develop a clone of Microsoft Teams application.

### Website Link
A hosted version of this website on heroku can be found [here](https://boxing-poppy-43327.herokuapp.com/).

## Key Highlights

### Features
* Group video and audio call
* Chat
* Screen share
* Audio and video controls
* Participants List
* Sharable Invite Message
* Dedicated Leave meeting option

### Specialities
* Only people having access to the roomId can view the chat and join meetings
* Allows people to join back in the same room and view the chat before or after meeting
* Encrypts the chat before storing on server to maintain privacy and security of chats taking place in a room
* Has STUN servers configured and hence allows peer to peer connection over varied networks
* Allows zoom facility on video/screen being shared to have a better experience

## Getting Started

### Techstacks used

* Node.js
* Socket.IO
* PeerJS
* HTML
* CSS
* Bootstrap
* JavaScript
* jQuery

### Installation 

1.  Clone the repo
```
git clone https://github.com/sg-iitg/Quick-Connect-WebApp
```
2.  Install npm packages
```
npm install 
```
This will install all dependencies mentioned in package.json

### Execution

* Start the server
```
nodemon server.js 
```
Note: Setup the peerjs and local servers to listen on the same port when working on local host

## Usage
### Homepage

Two types of users can join a video call, the host or the invitiees:
* The host has to simply add their username and start a meeting. This will take him to a new room with a unique roomId using which he can invite other people to the meeting.
 
  ![](/window_snippets/start-meet.png)
  
* Invitiees are required to add their username and the roomId of the particular meeting they wish to join.

  ![](/window_snippets/join-room.png)
  
### Meeting Area
* Meeting area looks something like this

  ![](/window_snippets/meet-area.png)
  
* View the participants list

  ![](/window_snippets/participants-list.png)
  
* Chat with people 

  ![](/window_snippets/chat.png)
  
* Sharable invite message, easy to copy and share

  ![](/window_snippets/send-invite.png)
  
* Ability to zoom in to a person's shared screen, on simple tap

  ![](/window_snippets/share-screen.png)
  
* Alert everyone when someone leaves the meet

  ![](/window_snippets/leave-meet.png)
  
### Leave meet page
* Leave meet page, option to go back to hompepage

  ![](/window_snippets/leave-meet-page.png)
  
* Come back to the same room to view the chat history

  ![](/window_snippets/chat-history.png)
  
PS: Videos of all participants were kept off while taking the screenshots for security reasons
  
## Acknowledgements

* [Web Dev Simplified YouTube Channel](https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw)

* Homepage template inspired from [CodePen](https://codepen.io/)
* All icons have been taken from [FontAwesome](https://fontawesome.com/)
* [Poppins](https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&display=swap) for fonts
* [uuid](https://www.npmjs.com/package/uuid), to generate random and unique roomIDs
