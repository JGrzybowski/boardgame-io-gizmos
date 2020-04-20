import React from "react";
import "./App.css";
import { PlayerBar } from "./components/playerBar";
import { OpponentBar } from "./components/playerBar";

export const App: React.FC = () => {
  const styles2players = {
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "50vw 50vw",
    gridTemplateRows: "30vh 40vh 30vh",
    gridTemplateAreas: `
    "op1 op1"
     ". ." 
     "localPlayer localPlayer"`,
  };

  const styles3players = {
    display: "grid",
    gridTemplateColumns: "50vw 50vw",
    gridTemplateRows: "30vh 40vh 30vh",
    gridTemplateAreas: `"op1 op2"
                        ". ." 
                        "localPlayer localPlayer"`,
  };

  const styles4players = {
    display: "grid",
    gridTemplateColumns: "50vw 50vw",
    gridTemplateRows: "30vh 40vh 30vh",
    gridTemplateAreas: `"op1 op2"
                        ". ."  
                        "op3 localPlayer"`,
  };

  return (
    <div className="App" style={styles4players}>
      <OpponentBar styles={{ gridArea: "op1", alignSelf: "top" }} flipped={true} />
      <OpponentBar styles={{ gridArea: "op2", alignSelf: "top" }} flipped={true} />
      <OpponentBar styles={{ gridArea: "op3", alignSelf: "bottom" }} />
      <PlayerBar styles={{ gridArea: "localPlayer" }} />
    </div>
  );
};

export default App;
