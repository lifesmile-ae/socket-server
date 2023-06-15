// server.ts
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors()); // Enable CORS with the specified origin
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with the URL of your Vite app
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let screenCastActive = false;

io.on("connection", (socket: Socket) => {
  console.log("Client connected");

  socket.on("startScreenCast", () => {
    if (!screenCastActive) {
      console.log("Screen cast started");
      screenCastActive = true;
      socket.broadcast.emit("screenCastStarted");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (screenCastActive) {
      screenCastActive = false;
      socket.broadcast.emit("screenCastStopped");
    }
  });
});

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
