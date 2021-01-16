import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./join.css";

function Join() {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const history = useHistory();

    return (
        <div className="joinOuterContainer">
            <div className="info">This is sample information</div>
            <div className="formWrapper">
                <div className="joinInnerContainer">
                    <h1 className="heading">Create Room</h1>
                    <div className="form">
                        <input
                            placeholder="Name"
                            className="joinInput leftInput"
                            type="text"
                            onChange={(event) => setName(event.target.value)}
                        />
                        <input
                            placeholder="Room"
                            className="joinInput rightInput"
                            type="text"
                            onChange={(event) => setRoom(event.target.value)}
                        />
                    </div>
                    <Link
                        onClick={(e) =>
                            !name || !room ? e.preventDefault() : null
                        }
                        to={{
                            pathname: `/chat`,
                            search: `?name=${name}&room=${room}`,
                            state: { isCreate: true },
                        }}>
                        <button className={"button mt-20"} type="submit">
                            Create and join
                        </button>
                    </Link>
                </div>
                <div className="joinInnerContainer">
                    <h1 className="heading">Join Room</h1>
                    <div className="form">
                        <input
                            placeholder="Name"
                            className="joinInput leftInput"
                            type="text"
                            onChange={(event) => setName(event.target.value)}
                        />
                        <input
                            placeholder="Room"
                            className="joinInput rightInput"
                            type="text"
                            onChange={(event) => setRoom(event.target.value)}
                        />
                    </div>
                    <Link
                        onClick={(e) =>
                            !name || !room ? e.preventDefault() : null
                        }
                        to={{
                            pathname: `/chat`,
                            search: `?name=${name}&room=${room}`,
                            state: { isCreate: false },
                        }}>
                        <button className={"button mt-20"} type="submit">
                            Join
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Join;
