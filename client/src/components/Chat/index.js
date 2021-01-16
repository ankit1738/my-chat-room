import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./index.css";
import { useHistory, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import Chatbar from "../Chatbar";

let socket;

function Chat() {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [usersOnline, setUsersOnline] = useState([]);
    const history = useHistory();
    const location = useLocation();
    let SERVER = "localhost:5000";

    useEffect(() => {
        const { room, name } = queryString.parse(location.search);
        const isCreate = location.state.isCreate;

        socket = io(SERVER);

        setName(name);
        setRoom(room);
        socket.emit("join", { name, room, isCreate }, (error) => {
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
        socket.on("privateMessage", (message) => {
            setMessages((previous) => [...previous, message]);
        });
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            console.log(message);
            console.log(message[0]);
            if (message[0] === "@") {
                const pos = message.indexOf(" ");
                const user = usersOnline.find(
                    (user) => user.name === message.slice(1, pos)
                );
                socket.emit(
                    "privateMessage",
                    { message: message.slice(pos, message.length), user },
                    () => setMessage("")
                );
            } else {
                socket.emit("sendMessage", message, () => setMessage(""));
            }
        }
    };

    console.log(messages);
    return (
        <div className="outerContainer">
            <Sidebar room={room} usersOnline={usersOnline} />
            <Chatbar
                usersOnline={usersOnline}
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
