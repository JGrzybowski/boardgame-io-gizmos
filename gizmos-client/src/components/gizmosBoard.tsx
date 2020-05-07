import React from "react";
import { CardsPile } from "./cardsPile";
import { PlayerBar } from "./playerBar";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { EnergyOrb } from "./energyOrb";
import { EnergyType } from "../basicGameElements";

interface BoardProps {
  G: GameState;
  ctx: GameContext;
  moves: any;
  events: unknown; //An object containing functions to dispatch various game events like endTurn and endPhase.
  plugins: any;
  reset: () => void;
  undo: () => void; //Function that undoes the last move.
  redo: () => void; //Function that redoes the previously undone move.
  //step: //Function that will advance the game if AI is configured.
  //log: //The game log.
  //gameID: //The game ID associated with the client.
  //playerID: //The player ID associated with the client.
  //gameMetadata: //An object containing the players that have joined the game from a room.
}

export const GizmosBoard: React.FC<BoardProps> = (props) => {
  const { G, ctx, moves, events, plugins } = props;

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
        "commonArea energy"
        "commonArea localPlayer"`,
  };

  const energyRail = G.dispenser
    .slice(0, G.visibleEnergyBallsLimit)
    .map((energy, index) => (
      <EnergyOrb energyType={energy} key={`${index}${energy}`} OnClick={() => moves.pickAction(index)} />
    ));

  const playerState = plugins.player.data.players[ctx.currentPlayer];
  console.log(plugins.player.data.players[ctx.currentPlayer]);

  return (
    <div style={styles1players}>
      <div id="commonArea" style={{ ...commonAreaGridStyle, gridArea: "commonArea" }}>
        <CardsPile cards={G.cards} moves={moves} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gridArea: "energy" }}>{energyRail}</div>
      <PlayerBar style={{ gridArea: "localPlayer" }} playerState={playerState} />
    </div>
  );
};
