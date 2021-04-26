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

function leaveRoom() {
  location.href = '/lobby';
}

socket.on('connectedUser', connectedUser => {
  console.log(connectedUser);
  if(connectedUser >=2 && connectedUser <= 4){
  startGame();
  }
});

// if(test == true) {
//   numberOfUsers++;
// }

// socket.on('disconnectedUser', disconnectedUser => {
//   console.log(disconnectedUser);
// });

function startGame(connectedUser) {
  // button.innerHTML = 'Starting...';
  let button = document.getElementById("start-btn");
console.log(typeof connectedUser);

  // if(connectedUser >= 2 && connectedUser <= 4){
  //   Number(connectedUser);
  //   button.disabled = false;
  // } else{
  //   button.disabled = true;
  // }

  // if(button.disabled === false && button.clicked == true) {
    button.onclick = '/game/guesser';
  // } else {
  //   console.log('Hello');
  //   console.log(typeof connectedUser);
  // }

/*  if(connectedUser >= 2 || connectedUser <= 4){
  // location.href = '/game/guesser';
  //button.setAttribute(href, '/game/guesser');
    if(button.onclick == true){
      button.setAttribute(href, '/game/guesser');
    }
  } else {
    console.log('Test');
    console.log(typeof connectedUser);
  }*/
  //console.log(typeof connectedUser);
}

/* function EnableDisable(txtPassportNumber) {
  //Reference the Button.
  var btnSubmit = document.getElementById("btnSubmit");

  //Verify the TextBox value.
  if (txtPassportNumber.value.trim() != "") {
      //Enable the TextBox when TextBox has value.
      btnSubmit.disabled = false;
  } else {
      //Disable the TextBox when TextBox is empty.
      btnSubmit.disabled = true;
  }
}; */