import React from "react";
import "./App.css";
import Join from "./components/Join";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Join />
                </Route>
                <Route path="/chat">
                    <Chat />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
