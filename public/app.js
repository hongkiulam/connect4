// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.

const client = feathers();

client.configure(feathers.socketio(socket));

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const button = document.querySelector("button");
const moveList = document.querySelector(".moveList");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;
  createMove(value);
  input.value = "";
});

const createMove = async (value) => {
  value !== '' && await client.service("moves").create({ move: value });
};

client.service("moves").on("created",  (data) => {
  console.log(data.move);
  moveList.innerHTML += `<li>${data.move}</li>`
});

const initialPopulate = async ()=>{
const initial = await client.service("moves").find({
  query: {
    $limit: 99,
  },
});
console.log(initial.data);
initial.data.forEach((data)=>{
    moveList.innerHTML += `<li>${data.move}</li>`;

})
}
initialPopulate();