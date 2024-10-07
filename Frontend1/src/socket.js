import { io } from "socket.io-client";

let socket;

if (!socket) {
  socket = io("http://localhost:4000", {
    autoConnect: false,
  });
}

export default socket;
