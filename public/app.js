// Establish a Socket.io connection
const socket = io('localhost:3030');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();
client.configure(feathers.socketio(socket));

// socket io listeners
client.io.on('playerConnected',(data)=>{
  console.table(data)
})

client.io.on('playerDisconnected', (data)=>{
  console.table(data);
})

client.io.on('allPlayers', (data)=>{
  console.log(data);
  playerCount.innerText = data.length 
})

// variables
const moves = client.service('moves');
const playerCount = document.querySelector('.playerCount');


const createMove = async () => {
 await moves.create({ move: value });
};

moves.on("created",  (data) => {
});
