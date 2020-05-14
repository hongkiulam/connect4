import { gamePage, landingPage } from "./views.js";
/* 
TODO PWA
audiocontext
*/

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >> Global Variables                  >> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

const root = document.querySelector(".root");
let playerTextOne;
let playerTextTwo;
let roomId = window.location.pathname.toLowerCase();
let currentPlayer;

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >> Render Pages                      >> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >> Router                            >> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
window.addEventListener("load", () => {
  if (roomId == "/" || roomId == "/index.html") {
    renderLandingPage();
  } else {
    renderGamePage();
  }
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >> Establish a Socket.io connection  >> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

const socket = io();

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

socket.on("currentPlayer", (player) => {
  currentPlayer = player;
  const subheading = document.querySelector(".subheading");
  subheading.textContent =
    currentPlayer == 1
      ? "- connected as: player 1 -"
      : "- connected as: player 2 -";
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >> Game                              >> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
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
      // generate randomwhoseturn and sync up with other player, will prioritise last to send
      socket.emit("randomiseWhoseTurn", { roomId });

      const gameWrapper = document.querySelector(".game_wrapper");
      gameWrapper.innerHTML = "";
      // generate playing field
      gameState.gameField.forEach((col, colIndex) => {
        col.forEach((row, rowIndex) => {
          gameWrapper.innerHTML += `<div class="cell" id="${colIndex}-${rowIndex}" data-col="${colIndex}" data-row="${rowIndex}"></div>`;
        });
      });
      const handleCellClick = (e) => {
        if (currentPlayer == gameState.whoseTurn) {
          const { col, row } = e.target.dataset;
          console.log(`%c Clicked ${col}-${row}`, "color:orange");
          // tell server to flip whoseTurn
          socket.emit("updateWhoseTurn", {
            whoseTurn: gameState.whoseTurn,
            roomId,
          });
          gameState.dropDisc(parseInt(col), parseInt(row), currentPlayer);
        } else {
          console.warn("Not your turn");
          const gameWrapper = document.querySelector(".game_wrapper");
          gameWrapper.classList.add("flashRed");
          setTimeout(() => {
            gameWrapper.classList.remove("flashRed");
          }, 550);
        }
      };
      // handle event listeners
      document.querySelectorAll(".cell").forEach((cell) => {
        // remove old eventlistener if game was previously initiated
        cell.removeEventListener("click", handleCellClick);
        // add event listener
        cell.addEventListener("click", handleCellClick);
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
    dropDisc: (col, row, currentPlayer) => {
      // dropped disc logic here
      // pass disc to fill into event
      let rowToFill = row;
      gameState.gameField[col].forEach((row, index) => {
        if (row == 0) {
          rowToFill = index;
        }
      });
      socket.emit("droppedDisc", {
        col,
        row: rowToFill,
        player: currentPlayer,
        roomId,
      });
    },
    checkWin: (col, row) => {
      console.log("%c Checking for win...", "color:orange");
      if (
        gameState.getAdj(col, row, 0, 1) + gameState.getAdj(col, row, 0, -1) >
        2
      ) {
        return true;
      } else {
        if (gameState.getAdj(col, row, 1, 0) > 2) {
          return true;
        } else {
          if (
            gameState.getAdj(col, row, -1, 1) +
              gameState.getAdj(col, row, 1, -1) >
            2
          ) {
            return true;
          } else {
            if (
              gameState.getAdj(col, row, 1, 1) +
                gameState.getAdj(col, row, -1, -1) >
              2
            ) {
              return true;
            } else {
              return false;
            }
          }
        }
      }
    },
    getAdj: (col, row, colIncrement, rowIncrement) => {
      if (
        gameState.cellVal(col, row) ==
        gameState.cellVal(col + colIncrement, row + rowIncrement)
      ) {
        return (
          1 +
          gameState.getAdj(
            col + colIncrement,
            row + rowIncrement,
            colIncrement,
            rowIncrement
          )
        );
      } else {
        return 0;
      }
    },
    cellVal: (col, row) => {
      const gF = gameState.gameField;
      if (gF[col] == undefined || gF[col][row] == undefined) {
        return -1;
      } else {
        return gF[col][row];
      }
    },
    playerHasWon: (player) => {
      alert(`Player ${player} Has Won! \nRestarting Game...`);
      gameState.gameField = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];
      gameState.generateField();
    },
  };

  // Start Game
  gameState.generateField();
  gameState.updatePlayerText();

  socket.on("randomiseWhoseTurn", (randomWhoseTurn) => {
    gameState.whoseTurn = randomWhoseTurn;
    gameState.updatePlayerText();
  });
  socket.on("updateWhoseTurn", (nextWhoseTurn) => {
    gameState.whoseTurn = nextWhoseTurn;
    gameState.updatePlayerText();
  });
  socket.on("droppedDisc", ({ col, row, player }) => {
    const colorToFill = player == 1 ? "var(--playerOne)" : "var(--playerTwo)";
    const disc = document.getElementById(`${col}-${row}`);
    disc.style.backgroundColor = colorToFill;
    gameState.gameField[col][row] = player;
    // Check for win condition
    if (gameState.checkWin(col, row)) {
      setTimeout(() => {
        gameState.playerHasWon(player);
      }, 300);
    }
  });
};
