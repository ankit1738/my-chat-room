const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: String,
    users: [{ socketId: String, name: String }],
});

module.exports = mongoose.model("Room", roomSchema);
