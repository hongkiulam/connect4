// VIEWS
const gamePage = `<div class="wrapper">
<h1 class="title">cnct 4</h1>
<div class="game_wrapper"></div>
<div class="info">
  <span class="playerText one selected">player 1</span>
  <span class="playerText two">player 2</span>
</div>
</div>`;

const landingPage = `<form class="join_room_form">
<input type="text" class="room_id_input" autofocus />
<button type="submit" class="join_room_btn" onclick="(e)=>{e.preventDefault();}"><span>join</span> <img class="join_arrow" src="./arrow.svg" /></button>
</form>
`;

// >> Establish a Socket.io connection
const socket = io();

// >> Variables
const root = document.querySelector(".root");
let playerTextOne;
let playerTextTwo;
let roomId = window.location.pathname.toLowerCase();
let currentPlayer;

// >> Render pages
const renderLandingPage = () => {
  root.innerHTML = landingPage;
  const joinRoomForm = document.querySelector(".join_room_form");
  const roomIdInput = document.querySelector(".room_id_input");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(roomIdInput);
    const desiredRoom = roomIdInput.value.toLowerCase();
    window.location.href = window.location.origin + "/" + desiredRoom;
    console.log("Joined ", desiredRoom);
  };
  joinRoomForm.addEventListener("submit", handleSubmit);
};
const renderGamePage = () => {
  root.innerHTML = gamePage;
  playerTextOne = document.querySelector(".playerText.one");
  playerTextTwo = document.querySelector(".playerText.two");
  socket.emit("room", roomId);
};

// >> Router
if (roomId == "/") {
  renderLandingPage();
} else {
  renderGamePage();
}

// >> Socket io listeners

socket.on("joinedRoom", (message) => {
  console.log(message);
});
socket.on("playerConnected", (message) => {
  console.log(message);
});
socket.on("thisRoom", (thisRoom) => {
  console.log(`Players in room : ${thisRoom.length}`);
  thisRoom.length >= 1
    ? (playerTextOne.style.opacity = "1")
    : (playerTextOne.style.opacity = "0.1");
  thisRoom.length == 2
    ? (playerTextTwo.style.opacity = "1")
    : (playerTextTwo.style.opacity = "0.1");
});
// bug, if two are connected and player one refreshes, both are now player two
socket.on("currentPlayer", (currentPlayer) => {
  currentPlayer = currentPlayer;
  console.log(`I am player ${currentPlayer}`);
});
socket.on("roomIsFull", () => {
  console.log(`${roomId} is full`);
  root.innerHTML = `
  <span class="room_full_error">room is full</span>
  <button class="go_back_btn"><img class="go_back_arrow" src="./arrow.svg" />go back</button>
  `;
  const goBackBtn = document.querySelector(".go_back_btn");
  goBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  });
});
