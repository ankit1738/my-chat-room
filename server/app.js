const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const {
    joinRoom,
    createRoom,
    removeUser,
    getUser,
    getUsersInRoom,
} = require("./user");

const PORT = process.env.PORT || 5000;
const PASS = "Ankit@1738";
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

mongoose.connect(
    `mongodb+srv://ankit1738:${PASS}@chatroom.u7ccb.mongodb.net/ChatRoom?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        dbName: "ChatRoom",
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Database connected");
});

app.use(router);
app.use(cors());

app.get("/", (req, res) => {
    res.send("App is up and running");
});
io.on("connection", (socket) => {
    let user, error;
    console.log("Connected user");

    socket.on("join", async ({ name, room, isCreate }, callback) => {
        if (isCreate) {
            //when braces { appear as the beginning of a statement, they are interpreted as a block
            //below syntax to destructure obj withour declaring variables
            //the trick is to wrap the whole stmt in paranthesis
            ({ user, error } = await createRoom({
                socketId: socket.id,
                name,
                room,
            }));
        } else {
            ({ user, error } = await joinRoom({
                socketId: socket.id,
                name,
                room,
            }));
        }
        if (error) return callback(error);
        socket.emit("message", {
            user: "admin",
            text: `${user.name}, Welcome to room ${user.room}`,
            isPrivate: false,
        });

        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `${user.name} has joined`,
            isPrivate: false,
        });

        socket.join(user.room);
        io.in(user.room).emit("roomData", {
            room: user.room,
            users: await getUsersInRoom(user.room),
        });
    });

    socket.on("sendMessage", async (message, callback) => {
        const user = await getUser(socket.id);

        io.in(user.room).emit("message", {
            user: user.name,
            text: message,
            isPrivate: false,
        });

        callback();
    });

    socket.on("privateMessage", async (obj, callback) => {
        const { message, user } = obj;
        const sender = await getUser(socket.id);
        io.to(user.socketId).to(socket.id).emit("privateMessage", {
            user: sender.name,
            text: message,
            isPrivate: true,
            receiver: user.name,
        });
        callback();
    });

    socket.on("disconnect", async () => {
        console.log("disconnected user");
        const user = await removeUser(socket.id);
        if (user) {
            io.in(user.room).emit("message", {
                user: "admin",
                text: `${user.name} left the room`,
                isPrivate: false,
            });
            io.in(user.room).emit("roomData", {
                room: user.room,
                users: await getUsersInRoom(user.room),
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
