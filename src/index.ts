import express from "express";
import http from "http";
import socketio from "socket.io";
import path from "path";

const app = express();
const server = new http.Server(app);
const io = socketio(server);

server.listen(process.env.PORT || 3000);

app.use(express.static("public"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

io.on("connection", (socket) => {
  // when someone joins a room
  socket.on("room", (roomId: string) => {
    const roomToConnect = socket.adapter.rooms[roomId];
    // if room is not full
    if (!roomToConnect || roomToConnect.length < 2) {
      socket.join(roomId);
      socket.emit("joinedRoom", `Welcome to ${roomId}`);
      socket.to(roomId).emit("playerConnected", `A player has join ${roomId}`);
      io.to(roomId).emit("thisRoom", socket.adapter.rooms[roomId]);
      socket.emit("currentPlayer", socket.adapter.rooms[roomId].length);
      socket.leave(socket.id);
    } else {
      //emit error that room is full
      socket.emit("roomIsFull");
    }
  });

  socket.on("randomiseWhoseTurn", ({ roomId }) => {
    const randomWhoseTurn = Math.floor(Math.random() * 2) + 1;
    io.to(roomId).emit("randomiseWhoseTurn", randomWhoseTurn);
  });

  socket.on("updateWhoseTurn", ({ whoseTurn, roomId }) => {
    const nextWhoseTurn = whoseTurn === 1 ? 2 : 1;
    io.to(roomId).emit("updateWhoseTurn", nextWhoseTurn);
  });

  socket.on("droppedDisc", ({ row, col, player, roomId }) => {
    io.to(roomId).emit("droppedDisc", { col, row, player });
  });

  socket.on("disconnecting", () => {
    const roomId = Object.keys(socket.rooms)[0];
    io.to(roomId).emit("thisRoom", ["oneplayerleft"]);
    // if somone leaves, set the remaining player to player 1
    socket.to(roomId).emit("currentPlayer", 1);
  });
});
