const mongoose = require("mongoose");
const User = require("./models/user");
const Room = require("./models/room");

const joinRoom = async ({ socketId, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    try {
        const existingRoom = await Room.findOne({ name: room });
        if (existingRoom) {
            const existingUser = existingRoom.users.find(
                (user) => user.name === name
            );
            if (existingUser) {
                return { error: "Username exists in this room" };
            } else {
                const user = await User.create({
                    socketId: socketId,
                    name: name,
                    room: room,
                });
                existingRoom.users.push({
                    socketId: user.socketId,
                    name: user.name,
                });
                await existingRoom.save();
                return { user };
            }
        } else {
            return { error: "Room does not exists. Please create and join" };
        }
    } catch (err) {
        console.log(err);
        return { error: "Something went wrong" };
    }
};

const createRoom = async ({ socketId, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    try {
        const existingRoom = await Room.findOne({ name: room });
        if (existingRoom) {
            return { error: "Room already exists." };
        } else {
            const user = await User.create({
                socketId: socketId,
                name: name,
                room: room,
            });
            const newRoom = await Room.create({
                name: room,
                users: [{ socketId: user.socketId, name: user.name }],
            });

            return { user };
        }
    } catch (err) {
        console.log(err);
        return { error: "Something went wrong" };
    }
};

const removeUser = async (id) => {
    const user = await User.findOneAndDelete({ socketId: id });
    console.log(user);
    if (user) {
        const room = await Room.findOneAndUpdate(
            { name: user.room },
            { $pull: { users: { socketId: user.socketId } } },
            { new: true }
        );
        console.log(room);
        if (room.users.length === 0) {
            console.log("deleting room");
            const deletedRoom = await Room.findOneAndDelete({
                name: room.name,
            });
            console.log(deletedRoom);
            return null;
        }
        return user;
    } else {
        return null;
    }
};

const getUser = async (id) => {
    return await User.findOne({ socketId: id });
};

const getUsersInRoom = async (roomName) => {
    const room = await Room.findOne({ name: roomName });
    console.log(room);
    return room.users;
};

module.exports = { joinRoom, createRoom, removeUser, getUser, getUsersInRoom };
