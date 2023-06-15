"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Enable CORS with the specified origin
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});
let screenCastActive = false;
io.on("connection", (socket) => {
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
