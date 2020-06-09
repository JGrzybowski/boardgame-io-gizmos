import React from "react";
import "./App.css";
import { GizmosBoard } from "./components/gizmosBoard";
import Gizmos from "./game";
import { Local } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";

const GizmosClient = Client({
  game: Gizmos,
  gameID: "default",
  board: GizmosBoard,
  debug: true,
  numPlayers: 1,
  multiplayer: Local({ bots: {} }),
});

export const App: React.FC = () => {
  return (
    <div className="App">
      <GizmosClient debug={false} playerID="0" />
    </div>
  );
};

export default App;
