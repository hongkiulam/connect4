// VIEWS
const gamePage = `<div class="wrapper">
<h1 class="title">cnct 4</h1>
<div class="game_wrapper"></div>
<div class="info">
  <span class="playerText one selected">player 1</span>
  <span class="playerText two">player 2</span>
</div>
</div>`;

const landingPage = `<form>
<input type="text" class="room_id_input" />
<button type="button" class="join_room">join</button>
</form>
`;

// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();
client.configure(feathers.socketio(socket));

// variables
const moves = client.service("moves");
const root = document.querySelector(".root");
let playerTextOne;
let playerTextTwo;
let roomIdInput;
let joinRoomBtn;
let roomId = "";

window.addEventListener("load", () => {
  root.innerHTML = landingPage;
  joinRoomBtn = document.querySelector(".join_room");
  roomIdInput = document.querySelector(".room_id_input");

  joinRoomBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    roomId = roomIdInput.value;
    if (roomId != "") {
      await client.service("rooms").create({ roomId });
      console.log("Joined ", roomId);
    }

    root.innerHTML = gamePage;
    playerTextOne = document.querySelector(".playerText.one");
    playerTextTwo = document.querySelector(".playerText.two");
    console.log(client.channel.connections());
  });
});

// socket io listeners
client.io.on("playerConnected", (data) => {
  console.table(data);
});

client.io.on("playerDisconnected", (data) => {
  console.table(data);
});

client.io.on("allPlayers", (data) => {
  console.log(data.length);
  data.length >= 1
    ? (playerTextOne.style.opacity = "1")
    : (playerTextOne.style.opacity = "0.1");
  data.length == 2
    ? (playerTextTwo.style.opacity = "1")
    : (playerTextTwo.style.opacity = "0.1");
});

moves.on("created", () => {
  console.log("hello");
});

const createMove = async () => {
  await moves.create({ move: "value", roomId });
};
