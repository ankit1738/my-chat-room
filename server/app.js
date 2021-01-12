const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const app = express();
var cors = require("cors");

const PORT = process.env.PORT || 5000;
const { addUser, removeUser, getUser, getUsersInRoom } = require("./user");
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(router);
app.use(cors());

io.on("connection", (socket) => {
    console.log("Connected user");

    socket.on("join", ({ name, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.emit("message", {
            user: "admin",
            text: `${user.name}, Welcome to room ${user.room}`,
        });
        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `${user.name} has joined`,
        });

        socket.join(user.room);
        io.in(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.in(user.room).emit("message", { user: user.name, text: message });

        callback();
    });

    socket.on("disconnect", () => {
        console.log("disconnected user");
        const user = removeUser(socket.id);
        if (user) {
            io.in(user.room).emit("message", {
                user: "admin",
                text: `${user.name} left the room`,
            });
            io.in(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

server.listen(PORT, (err) => {
    if (err) console.log(err);
    else {
        console.log(`Server Running on port ${PORT}`);
    }
});
