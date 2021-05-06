const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const scoreList = document.getElementById("score");
const userScore = document.getElementById("userScore")

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatRoom
let score = 0;
socket.emit("joinRoom", { username, room, score });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
  outputScoreboard(users)
});

socket.on("startButton", (users) => {
  enableStartButton(users);
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

function outputScoreboard(users) {
  userScore.innerHTML = "";

  users.forEach((user) => {
    if(li1 !== user.username) {
    const li1 = document.createElement("li")
    const li2 = document.createElement("li");
    li1.innerText = user.username;
    li2.setAttribute("id", user.username);
    li2.innerText = user.score;
    userScore.appendChild(li1);
    scoreList.appendChild(li2);
  }
  });
}

  socket.on('message', (message) => {
    if(message.text === correctAnswer){
      let li2 = document.getElementById(users[0].username);
      let tempScore = Number (li2.innerText);
      tempScore++;
      li2.innerText = tempScore;
      console.log(tempScore);
      // li2.innerText = user.score;
    }
  });


function playersInRoom(users) {
  let playersInRoom = [];
  let i = 0;
  users.forEach((user) => {
    playersInRoom[i] = user.username;
    i++;
  });
  return playersInRoom;
}

// Random Number -> Chosen One



function enableStartButton(users) {
  let players = playersInRoom(users);
  console.log('Hello1');
  console.log(players);
    

  
  const button = document.getElementById("start-btn");
  if(button !== null){
  if (players.length == 2) {
    button.disabled = false;
    //let randomnum = Math.floor(Math.random()*4);
    //console.log(randomnum);
    //let chosenOne = players[randomnum];
    //if (username == chosenOne)
    if (username == players[0]) {
      start2(users);  
    } else {
      start(users);
    }
    
    console.log("Test succes"); 
  } else {
    button.disabled = false;

    console.log("Test failed");
  }
}
}

socket.on('counter', function(count) {
  //$('#messages').append($('<li>').text(count));
  if (document.getElementById("counter") != null) {
    document.getElementById("counter").innerText = count;
  } else {
    console.log("Counter element not found");
  }
  console.log("COUNTER");
  console.log(count);
});
    


function leaveRoom() {
  location.href = "/lobby";
}

function quack() {
      var quack = document.getElementById("quack");
      function playAudio() {
        quack.play();
      }
      playAudio();
}

function start() {
  location.href = `/game/helper?username=${username}&room=${room}`;  
} 

function start2() {
  location.href = `/game/guesser?username=${username}&room=${room}`;  
}
/* 
socket.on('connectedUser', connectedUser => {
  console.log(connectedUser);
}); */

socket.on('connectedUser', message => {
  console.log(message);
});

let correctAnswer = "placeholder";
//Kun helper
if (document.getElementById('correctAnswer') != null) {
  let correctAnswer = document.getElementById('correctAnswer').innerText;
} else {
  //console.log("NULLBOI")
  let correctAnswer = "secretsauce";
}
// if (document.getElementById('correctAnswer') == null) {
//   let correctAnswer = document.getElementById('correctAnswer').innerText;  
//   console.log(correctAnswer);
//   console.log("HELLO");
// } else {
//   console.log("correctAnswer not found. Are you helper?");
// }

socket.on('message', (message) => {
  if(message.text === correctAnswer){
    console.log('yay'); 
    socket.emit('correct', 'Correct!');
  } else {
    console.log('no craic');
  }
});


socket.on('lmao', (lmao) => {
  console.log("lmao");
  location.href = `/game?username=${username}&room=${room}`;
});
