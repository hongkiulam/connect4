export default (io:SocketIO.Server) => {
    let players: string[] = [];
    io.on("connection", (socket) => {
        players.push(socket.id);
        console.log(players);
        socket.emit("playerConnected", { text: "Player connected", id: socket.id });
        io.emit('allPlayers', players);

        socket.on("disconnect", () => {
            players.splice(players.indexOf(socket.id), 1);
            socket.broadcast.emit("playerDisconnected", {
                text: `Player disconnected`, id:socket.id
            });
            io.emit('allPlayers', players);
        });
    });
}