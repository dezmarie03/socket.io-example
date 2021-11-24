import http from "http";
import handler from "serve-handler";
import nanobuffer from "nanobuffer";
import { Server } from "socket.io";

// Server port
const port = process.env.PORT || 8080;

// Create messages array that's limited to 50 entries
const msg = new nanobuffer(50);

// Get newest messages
const getMsgs = () => Array.from(msg).reverse();

// Create initial test message
msg.push({
  user: "the_moon",
  text: "Hello!",
  time: Date.now(),
});

// Set up server for static assets
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});

// Initialize Socket.io
const io = new Server(server, {});

io.on("connection", socket => {
  socket.emit("msg:get", { msg: getMsgs() });

  socket.on("msg:post", data => {
    msg.push({
      user: data.user,
      text: data.text,
      time: Date.now(),
    });

    // Broadcast to all open clients
    io.emit("msg:get", { msg: getMsgs() });
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
