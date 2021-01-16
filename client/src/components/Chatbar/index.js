import React, { useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./index.css";

function Chatbar({
    name,
    message,
    messages,
    setMessage,
    sendMessage,
    usersOnline,
}) {
    const [open, setOpen] = useState(false);
    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleClick = (e) => {
        const pos = message.indexOf("@");
        const pos2 = message.indexOf(" ", pos);
        const prefix = message.slice(0, pos);
        const suffix = pos2 > 0 ? message.slice(pos2, message.length) : "";
        console.log(message.slice(0, pos));
        console.log(message.slice(pos2, message.length));
        if (message[0] === "@") {
            setMessage(`@${e.target.innerHTML} ${suffix}`);
        } else {
            setMessage(`${prefix} ${e.target.innerHTML} ${suffix}`);
        }
        console.log(e.target.innerHTML);
        setOpen(false);
    };

    return (
        <div className="container right">
            <ScrollToBottom className="messages">
                {messages.map((message, index) =>
                    message.user === name.toLowerCase() ? (
                        <>
                            <div className="msgBox" key={index}>
                                <div
                                    className={
                                        "moveRight " +
                                        (message.isPrivate
                                            ? "privateSender"
                                            : "")
                                    }>
                                    {message.text}
                                </div>
                                <div className="userNameRight">
                                    {message.isPrivate
                                        ? `Private message to ${message.receiver}`
                                        : message.user}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="msgBox" key={index}>
                                <div
                                    className={
                                        "moveLeft " +
                                        (message.isPrivate
                                            ? "privateReceiver"
                                            : "")
                                    }>
                                    {message.text}
                                </div>
                                <div className="userNameLeft">
                                    {message.isPrivate
                                        ? `Private message from ${message.user}`
                                        : message.user}
                                </div>
                            </div>
                        </>
                    )
                )}
            </ScrollToBottom>
            <form>
                {open ? (
                    <ul className="usersList">
                        {usersOnline.map((users, index) =>
                            users.name !== name ? (
                                <li onClick={handleClick} key={index}>
                                    {users.name}
                                </li>
                            ) : null
                        )}
                    </ul>
                ) : null}
                <input
                    value={message}
                    onChange={handleChange}
                    onKeyPress={(e) =>
                        e.key === "Enter"
                            ? sendMessage(e)
                            : e.key === "@"
                            ? setOpen(true)
                            : null
                    }
                />
                <button onClick={(e) => sendMessage(e)}>Send</button>
            </form>
        </div>
    );
}

export default Chatbar;
