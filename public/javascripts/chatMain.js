const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const scoreList = document.getElementById('score');
const userScore = document.getElementById('userScore');
let myAudio = document.getElementById('myAudio');
let correctAnswer = document.getElementById('correctAnswer');
let counter = document.getElementById('counter');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Requirung socket.io
const socket = io();

// Join chatRoom
let score = 0;
socket.emit('joinRoom', { username, room, score });

socket.on('StartGame', (msg) => {
  console.log(msg);
});

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
  outputScoreboard(users);
});

// Start button from the game waiting room
socket.on('startButton', (users) => {
  enableStartButton(users);
});

socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  //Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

// Creating the scoreboard with usernames and a score at 0
function outputScoreboard(users) {
  if (scoreList !== null && userScore !== null) {
    userScore.innerHTML = '';

    users.forEach((user) => {
      // if(li1 !== user.username) {
      if (document.getElementById(user.username)) {
        console.log('already exist');
      } else {
        const li1 = document.createElement('li');
        const li2 = document.createElement('li');
        li1.innerText = user.username;
        li2.setAttribute('id', user.username);
        li2.innerText = user.score;
        userScore.appendChild(li1);
        scoreList.appendChild(li2);
      }
      // }
    });
  }
}

// socket.on('message', (message) => {
//   if(message.text === correctAnswer){
//     let li2 = document.getElementById(users[0].username);
//     let tempScore = Number (li2.innerText);
//     tempScore++;
//     li2.innerText = tempScore;
//     console.log(tempScore);
//     // li2.innerText = user.score;
//   }
// });

// Checking how many users are currently in the room
function usersInRoom(users) {
  let usersInRoom = [];
  let i = 0;
  users.forEach((user) => {
    usersInRoom[i] = user.username;
    i++;
  });
  console.log('FE USers in Room: ', usersInRoom);
  return usersInRoom;
}

function GetAllUsersFromRoom() {}

// Uses the userInRoom function. If there are less users in room than required, nothing will happen when pressing the start button
function enableStartButton(users) {
  // let user = usersInRoom(users);
  // console.log(user);
  socket.emit('startGame');

  // const button = document.getElementById('start-btn');
  // if (button !== null) {
  //   if (user.length == 3) {
  //     button.disabled = false;
  //     // The first user in the array will be the guesser
  //     if (username == user[0]) {
  //       guesserStart(users);
  //       // All other users will be helper
  //     } else {
  //       helperStart(users);
  //     }
  //     console.log('Test succes');
  //   } else {
  //     button.disabled = true;

  //     console.log('Test failed');
  //   }
  // }
}

function helperSelector() {
  socket.emit('helperSelector');
}

// Sound used if players try to press start button before it is enabled
function quack() {
  var quack = document.getElementById('quack');
  function playAudio() {
    quack.play();
  }
  playAudio();
}

//Mute button for the background music
function mute() {
  if (myAudio.muted == true) {
    myAudio.muted = false;
  } else {
    myAudio.muted = true;
  }
}

// All users can at any point leave the room and be taken back to the lobby
function leaveRoom() {
  location.href = '/lobby';
}

function helperStart() {
  location.href = `/game/helper?username=${username}&room=${room}`;
}

function guesserStart() {
  location.href = `/game/guesser?username=${username}&room=${room}`;
}

// Timer
socket.on('counter', function (count) {
  //$('#messages').append($('<li>').text(count));
  if (counter != null) {
    counter.innerText = count;
  }
});

// socket.on('connectedUser', message => {
//   console.log(message);
// });

//Only check if correct answer exists on the helper page
if (correctAnswer !== null) {
  correctAnswer = correctAnswer.innerText;
}

// If the users answers correctly a message will appear in the chat
socket.on('message', (message) => {
  if (message.text === correctAnswer) {
    console.log('yay');
    socket.emit('correct', 'Correct!');
  } else {
    console.log('no craic');
  }
});

// The score is updated
socket.on('updateScoreboard', (user) => {
  //console.log(user.score);
  let li = document.getElementById(user.username);
  li.innerText = Number(li.innerText) + 1;
  // if (user.score == NaN || user.score == undefined || user.score == null) {
  //   user.score = 0;
  //   console.log("kørt");
  // }
  // user.score++;
  // console.log(user.score);
  // li.innerText = user.score;
});
