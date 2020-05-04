import React from "react";
import { CardsPile } from "./cardsPile";
import { PlayerBar } from "./playerBar";

export const GizmosBoard: React.FC<any> = (board) => {
  const commonAreaGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateRows: "33% 34% 33%",
    margin: "40px",
  };

  const styles1players = {
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "50vw",
    gridTemplateRows: "50vh 50vh",
    gridTemplateAreas: `
        "commonArea ."
        "commonArea localPlayer"`,
  };

  return (
    <div style={styles1players}>
      <div id="commonArea" style={{ ...commonAreaGridStyle, gridArea: "commonArea" }}>
        <CardsPile cards={[]} />
      </div>
      <PlayerBar styles={{ gridArea: "localPlayer" }} />
    </div>
  );
};
