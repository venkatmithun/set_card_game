import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Game from "./features/game/Game";
import Home from "./features/Home";

export default function App() {
  return (
    <Router>
      <div id="app">
        {/* <div className="Header">
          <h1>Header</h1>
        </div> */}
        <Switch>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <p id="footer">Made by Venkat Mithun</p>
      </div>
    </Router>
  );
}
