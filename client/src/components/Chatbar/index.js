import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chatbar({ name, message, messages, setMessage, sendMessage }) {
    return (
        <div className="container right">
            <ScrollToBottom className="messages">
                {messages.map((message, index) =>
                    message.user === name.toLowerCase() ? (
                        <>
                            <div className="msgBox" key={index}>
                                <div className="moveRight">{message.text}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="msgBox" key={index}>
                                <div className="moveLeft">{message.text}</div>
                                <div class="userName">{message.user}</div>
                            </div>
                        </>
                    )
                )}
            </ScrollToBottom>
            <form>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) =>
                        e.key === "Enter" ? sendMessage(e) : null
                    }
                />
                <button onClick={(e) => sendMessage(e)}>Send</button>
            </form>
        </div>
    );
}

export default Chatbar;
