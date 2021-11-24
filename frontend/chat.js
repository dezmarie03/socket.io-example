const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const indicator = document.getElementById("indicator");

// Store current messages
let allChat = [];

// Server port
const port = 8080;

// Listen for submit
chat.addEventListener("submit", function (event) {
  event.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = ""; // Empty the input
});

// Post new messages to the server
async function postNewMsg(user, text) {
  const data = { user, text };

  socket.emit("msg:post", data);
}

const socket = io(`http://localhost:${port}`);

// Set indicator
socket.on("connect", () => {
  indicator.innerText = "🟢";
});

socket.on("disconnect", () => {
  indicator.innerText = "🔴";
});

// Render
socket.on("msg:get", data => {
  allChat = data.msg;
  render();
});

// Render new messages in HTML
const template = (user, msg) => `<li>${user} - ${msg}</li>`;

function render() {
  const html = allChat.map(({ user, text, time, id }) => {
    return template(user, text, time, id);
  });

  msgs.innerHTML = html.join("\n");
}
