import React from "react";
import "./index.css";
function Sidebar({ room, usersOnline }) {
    return (
        // css classes from chat component
        <div className="container left">
            <div className="leftTitle">Room:{room}</div>

            <div className="leftTitle">Online Users</div>
            <ul className="onlineList">
                {usersOnline.map((user, index) => (
                    <li key={index}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
