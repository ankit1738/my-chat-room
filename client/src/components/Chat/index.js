import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./index.css";
import { useHistory } from "react-router-dom";
import Sidebar from "../Sidebar";
import Chatbar from "../Chatbar";

let socket;

function Chat({ location }) {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [usersOnline, setUsersOnline] = useState([]);
    let SERVER = "localhost:5000";
    let history = useHistory();
    useEffect(() => {
        const { room, name } = queryString.parse(location.search);

        socket = io(SERVER);

        setName(name);
        setRoom(room);
        socket.emit("join", { name, room }, (error) => {
            if (error) {
                alert(error);
                history.push("/");
            }
        });
        return () => {
            socket.close();
        };
    }, [SERVER, location.search]);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages((previous) => [...previous, message]);
        });
        socket.on("roomData", (data) => {
            setUsersOnline(data.users);
        });
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("sendMessage", message, () => setMessage(""));
        }
    };

    console.log(messages);
    return (
        <div className="outerContainer">
            <Sidebar room={room} usersOnline={usersOnline} />
            <Chatbar
                name={name}
                messages={messages}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
            />
        </div>
    );
}

export default Chat;
