const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatRoom
socket.emit("joinRoom", { username, room });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("startButton", (users) => {
  enableStartButton(users);
});

/* socket.on('redirectToNewGame', (users, newGameURL) => {
  enableStartButton(users);
  window.location = newGameURL;
}) */

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  //Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

// function directUsers(users) {
//   const button = document.getElementById("start-btn");
//   let players = playersInRoom(users);
//   if (players < 1) {
//     console.log("succes");
//   } else {
//     console.log('Fuck mig');
//   }
// } 

function playersInRoom(users) {
  let playersInRoom = [];
  let i = 0;
  users.forEach((user) => {
    playersInRoom[i] = user.username;
    i++;
  });
  return playersInRoom;
}

function enableStartButton(users) {
  let players = playersInRoom(users);
  console.log('Hello1');
  const button = document.getElementById("start-btn");
  while(button !== null){
  if (players.length >= 2 && players.length <= 4) {
    button.disabled = false;
    //start(users);
    console.log("Test succes"); 
  } else {
    button.disabled = true;
    console.log("Test failed");
  }
}
}

function leaveRoom() {
  // location.href = "/lobby";
}

function start() {
  location.href = `/game/helper?username=${username}&room=${room}`;
}

function helper() {
  // location.href = "/game/helper";
}
/* 
socket.on('connectedUser', connectedUser => {
  console.log(connectedUser);
}); */

socket.on('connectedUser', message => {
  console.log(message);
});

let correctAnswer = document.getElementById('correctAnswer').innerText;
// console.log(correctAnswer);
console.log(correctAnswer);


socket.on('message', (message) => {
  if(message.text === correctAnswer){
    console.log('yay'); 
    socket.emit('correct', 'Correct!');
  } else {
    console.log('no craic');
  }
});
