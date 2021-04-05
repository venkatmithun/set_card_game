import { useDispatch } from "react-redux";
import React from "react";
import { setDifficulty } from "../features/game/gameSlice";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();

  return (
    <div>
      <h1>SET - A Card Game</h1>
      <a href="https://en.wikipedia.org/wiki/Set_(card_game)" target="blank">
        How to play?
      </a>
      <div>
        <h2>Play Game</h2>
        <span>By choose difficulty below</span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link to="/game" onClick={() => dispatch(setDifficulty(0))}>
            <h3>Easy</h3>
          </Link>
          <Link to="/game" onClick={() => dispatch(setDifficulty(1))}>
            <h3>Medium</h3>
          </Link>
          <Link to="/game" onClick={() => dispatch(setDifficulty(2))}>
            <h3>Hard</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
