// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();
client.configure(feathers.socketio(socket));

// variables
const moves = client.service('moves');
const playerTextOne = document.querySelector('.playerText.one');
const playerTextTwo = document.querySelector('.playerText.two');

// socket io listeners
client.io.on('playerConnected',(data)=>{
  console.table(data)
})

client.io.on('playerDisconnected', (data)=>{
  console.table(data);
})

client.io.on('allPlayers', (data)=>{
  console.log(data.length);
  data.length >= 1 ? playerTextOne.style.opacity = "1" : playerTextOne.style.opacity = "0.1";
  data.length == 2 ? playerTextTwo.style.opacity = "1" : playerTextTwo.style.opacity = "0.1";
})


const createMove = async () => {
 await moves.create({ move: value });
};

moves.on("created",  (data) => {
});
