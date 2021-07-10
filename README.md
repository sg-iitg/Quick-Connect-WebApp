# Quick Connect Web Application

# [Video Demonstration](https://youtube.com)

## About The Website

This is a web application made using Node.js framework, Socket.IO and PeerJS libraries. It allows group video and audio chat along with several other functionalities. I made this project as part of my submission for Microsoft Engage 2021. This was made as an attempt to develop a clone of Microsoft Teams application.

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
* Allows people to join back in the same room and view the chat before or after  meeting
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
* Javascript
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
Note: Setup the peerjs and localhost to same ports when trying to run on local system
