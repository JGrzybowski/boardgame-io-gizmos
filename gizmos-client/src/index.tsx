import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import Gizmos from "./game";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
