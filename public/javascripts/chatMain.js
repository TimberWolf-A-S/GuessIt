/**
 * Get elements from views
 */
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const scoreList = document.getElementById('score');
const userScore = document.getElementById('userScore');
let myAudio = document.getElementById('myAudio');
let correctAnswer = document.getElementById('correctAnswer');
let counter = document.getElementById('counter');

/**
 * Get username and room from URL
 */
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

/**
 * Requiring socket.io
 */
const socket = io();

/**
 * All users scores starts at 0
 */
let score = 0;

/**
 * Join chatRoom
 */
socket.emit('joinRoom', { username, room, score });


/**
 * Get room and users
 */
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
  outputScoreboard(users);
  startGame(users);
});

/**
 * Get messages and run formatting
 */
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

/**
 * Message submit
 */
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

/**
 * Output message to DOM
 */
function outputMessage(message) {
  //Create div for message
  const div = document.createElement('div');
  div.classList.add('message');
  //Create paragaph for username and time of message
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  //Add text of message to the div
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  //Append the div to the chat
  document.querySelector('.chat-messages').
  appendChild(div);
}

/**
 * Add room name to DOM
 */
function outputRoomName(room) {
  roomName.innerText = room;
}

/**
 * Add users to DOM
 */
function outputUsers(users) {
  //
  userList.innerHTML = '';
  //Creates list of users 
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

/**
 * Creating the scoreboard with usernames and score at 0 and output to DOM
 */
function outputScoreboard(users) {
  //If not generated yet, the scoreboard is created
  if (scoreList !== null && userScore !== null) {
    userScore.innerHTML = '';

    //Create elements for name and score of users
    users.forEach((user) => {
        const li1 = document.createElement('li');
        const li2 = document.createElement('li');
        li1.innerText = user.username;
        li2.setAttribute('id', user.username);
        li2.innerText = user.score;
        userScore.appendChild(li1);
        scoreList.appendChild(li2);
      });
  }
}

/**
 * Triggers when user presses the button connected to this 
 * function, in the game view
 */
 function helperImageSelector() {
   // Runs helperImageSelector in the socket.io connected in app.js
  socket.emit('helperImageSelector');
}

/**
 * Checking how many users are currently in the room
 */
function usersInRoom(users) {
  let usersInRoom = [];
  let i = 0;
  users.forEach((user) => {
    usersInRoom[i] = user.username;
    i++;
  });
  return usersInRoom;
}

/**
 * Uses the userInRoom function. 
 * If there are less users in room than required, nothing will 
 * happen when pressing the start button.
 * Else it will start the game automatically
 */
function startGame(users) {
  let user = usersInRoom(users);

  const button = document.getElementById('start-btn');
  // Only runs if start button is present
  if (button !== null) {
    // Starts game when two users are connected
    if (user.length === 2) {
      button.disabled = false;
      // The first user in the array will be the guesser
      if (username === user[0]) {
        guesserStart(users);
        // All other users will be helper
      } else {
        helperStart(users);
      }
    } else {
      button.disabled = true;
    }
  }
}

/**
 * Sound used if players try to press start button before it is enabled
 */
 function quackSound() {
  var quack = document.getElementById("quack");
  quack.play();
}

/**
 * Mute button for the background music
 */
function mute() {
  if (myAudio.muted == true) {
    myAudio.muted = false;
  } else {
    myAudio.muted = true;
  }
}

/**
 * All users can at any point leave the room and be taken back to the lobby
 */
function leaveRoom() {
  location.href = '/lobby';
}

/**
 * Sends helpers to correct route with the query string
 */
function helperStart() {
  location.href = `/game/helper?username=${username}&room=${room}`;
}

/**
 * Sends guesser to correct route with the query string
 */
function guesserStart() {
  location.href = `/game/guesser?username=${username}&room=${room}`;
}

/**
 * Timer for when the game starts
 */
socket.on('counter', function (count) {
  //As long as not run out, the timer is output to DOM
  if (counter != null) {
    counter.innerText = count;
  }
});

/**
 * Only check if correct answer exists on the helper page
 */
if (correctAnswer !== null) {
  correctAnswer = correctAnswer.innerText;
}

/**
 * If the users answers correctly a message will appear in the chat
 */
socket.on('message', (message) => {
  if (message.text === correctAnswer) {
    socket.emit('correct', 'Correct!');
  }
});

/**
 * The score is updated when the user answers correctly
 */
socket.on('updateScoreboard', (user) => {
  let li = document.getElementById(user.username);
  li.innerText = Number(li.innerText) + 1;
});
