"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const indexroute_1 = __importDefault(require("./routes/indexroute"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', indexroute_1.default);
const server = app.listen(process.env.PORT, () => {
    console.log(`The server is up on port : ${process.env.PORT}`);
});
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on("connection", (socket) => {
    socket.on("join-chat", (roomID) => {
        socket.join(roomID);
        console.log("user joined room", roomID);
    });
    socket.on("send-message", (data) => {
        console.log(data);
        socket.to(data.roomId).emit("recieve-message", data.message);
    });
    socket.on("disconnect", () => {
        console.log(`user disconnected : ${socket.id}`);
    });
});
