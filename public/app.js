import { gamePage, landingPage } from "./views.js";

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
    const desiredRoom = roomIdInput.value.toLowerCase().replace(" ", "-");
    window.location.href = window.location.origin + "/" + desiredRoom;
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
window.addEventListener("load", () => {
  if (roomId == "/") {
    renderLandingPage();
  } else {
    renderGamePage();
  }
});

// >> Socket io listeners (global)

socket.on("joinedRoom", (message) => {
  console.log(`%c ${message}`, "color:lightblue");
});
socket.on("playerConnected", (message) => {
  console.log(`%c ${message}`, "color:lightblue");
});
socket.on("thisRoom", (thisRoom) => {
  console.log(`%c Players in room : ${thisRoom.length}`, "color:lightblue");
  thisRoom.length >= 1
    ? (playerTextOne.style.opacity = "1")
    : (playerTextOne.style.opacity = "0.1");
  thisRoom.length == 2
    ? (playerTextTwo.style.opacity = "1")
    : (playerTextTwo.style.opacity = "0.1");
  if (thisRoom.length == 2) {
    const gameWrapper = document.querySelector(".game_wrapper");
    gameWrapper.innerHTML = `<span class="game_loading">> starting game <</span>`;
    setTimeout(gameInit, 500);
  }
});
// bug, if two are connected and player one refreshes, both are now player two
socket.on("currentPlayer", (player) => {
  currentPlayer = player;
  const title = document.querySelector(".title a");
  title.textContent =
    currentPlayer == 1 ? "cnct 4 | player 1" : "cnct 4 | player 2";
  // globally have a nickname variable, emitted with the room event, and then received through another event.
  // update innerText of relevant playerText here
});
socket.on("roomIsFull", () => {
  console.warn(`${roomId} is full`);
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

// >> Game
const gameInit = () => {
  console.log("%c Game Started", "color:green");
  const gameState = {
    /**
     * @param col x
     * @param row y
     */
    gameField: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    whoseTurn: 1,
    generateField: () => {
      const gameWrapper = document.querySelector(".game_wrapper");
      gameWrapper.innerHTML = "";
      // generate playing field
      gameState.gameField.forEach((col, colIndex) => {
        col.forEach((row, rowIndex) => {
          gameWrapper.innerHTML += `<div class="cell" id="${colIndex}-${rowIndex}" data-col="${colIndex}" data-row="${rowIndex}"></div>`;
        });
      });
      // addeventlistener
      document.querySelectorAll(".cell").forEach((cell) => {
        cell.addEventListener("click", (e) => {
          if (currentPlayer == gameState.whoseTurn) {
            const { col, row } = e.target.dataset;
            console.log(`%c Clicked ${col}-${row}`, "color:orange");
            // tell server to flip whoseTurn
            socket.emit("updateWhoseTurn", {
              whoseTurn: gameState.whoseTurn,
              roomId,
            });
            gameState.dropDisc(col, row);
          } else {
            console.warn("Not your turn");
          }
        });
      });
    },
    updatePlayerText: () => {
      if (gameState.whoseTurn == 1) {
        playerTextOne.classList.add("selected");
        playerTextTwo.classList.remove("selected");
      }
      if (gameState.whoseTurn == 2) {
        playerTextTwo.classList.add("selected");
        playerTextOne.classList.remove("selected");
      }
    },
    dropDisc: (col, row) => {
      // dropped disc logic here
      // pass disc to fill into event
      socket.emit("droppedDisc", { discId: `${col}-${row}`, roomId });
    },
  };
  gameState.generateField();
  gameState.updatePlayerText();
  socket.on("updateWhoseTurn", (nextWhoseTurn) => {
    gameState.whoseTurn = nextWhoseTurn;
    gameState.updatePlayerText();
  });
  socket.on("droppedDisc", (discId) => {
    const disc = document.getElementById(discId);
    disc.style.backgroundColor = "var(--accent)";
  });
};
