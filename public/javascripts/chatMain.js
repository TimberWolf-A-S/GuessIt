const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const scoreList = document.getElementById("score");
const userScore = document.getElementById("userScore");
let counter = document.getElementById("counter");

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
  outputScoreboard(users);
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
  if(scoreList !== null && userScore !== null){
  userScore.innerHTML = "";
  

  users.forEach((user) => {
    // if(li1 !== user.username) {
    if (document.getElementById(user.username)) {
      console.log("already exist");
    } else {
      const li1 = document.createElement("li")
      const li2 = document.createElement("li");
      li1.innerText = user.username;
      li2.setAttribute("id", user.username);
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
  console.log(players);

  const button = document.getElementById("start-btn");
  if(button !== null){
  if (players.length == 2) {
    button.disabled = false;
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
  if (counter != null) {
    counter.innerText = count;
  } // else {
    //console.log("Counter element not found");
  // }
  //console.log("COUNTER");
  //console.log(count);
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
  location.href = `/game/helper?username=${username}&room=${room}+Game`;  
} 

function start2() {
  location.href = `/game/guesser?username=${username}&room=${room}+Game`;  
}
/* 
socket.on('connectedUser', connectedUser => {
  console.log(connectedUser);
}); */

socket.on('connectedUser', message => {
  console.log(message);
});

let correctAnswer = document.getElementById('correctAnswer');
//Kun helper
if (correctAnswer !== null) {
  correctAnswer = correctAnswer.innerText;
}
// if (document.getElementById('correctAnswer') == null) {
//   let correctAnswer = document.getElementById('correctAnswer').innerText;  
//   console.log(correctAnswer);
//   console.log("HELLO");
// } else {
//   console.log("correctAnswer not found. Are you helper?");
// }
let theAnswerVariable;
function theAnswer(answer) {
  theAnswerVariable = answer;
}

socket.on('message', (message) => {
  if(message.text === correctAnswer){
    console.log('yay'); 
    socket.emit('correct', 'Correct!');
  } else {
    console.log('no craic');
  }
});

// socket.on('test', (test) => {
//   console.log(test);
//   if (document.getElementById('correctAnswer')) {
//     console.log("TRUE");
//     document.getElementById('correctAnswer').innerText = test;  
//   }
//   theAnswer(test);
//   //let banan = (location.href == `/game/helper?username=${username}&room=${room}`);
//   //if (banan == true) {
//   //  document.getElementById('correctAnswer').innerText = test;  
//   //}
  
// });


socket.on('scoreboard', (user) => {
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

