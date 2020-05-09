import React from "react";
import { CardsPile } from "./cardsPile";
import { PlayerBar } from "./playerBar";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { EnergyOrb } from "./energyOrb";
import { EnergyType } from "../basicGameElements";
import { CardStack } from "./cardStack";
import { PlayerState } from "../playerState";
import { MiniCard, Card } from "./card";
import { PlayerID } from "boardgame.io";
import { EnergyCounter } from "./energyCounter";
import { actionStage } from "../stages/actionStage";
import { activationStage } from "../stages/activationStage";
import { researchStage } from "../stages/researchStage";

interface BoardProps {
  G: GameState;
  ctx: GameContext;
  moves: any;
  events: any; //An object containing functions to dispatch various game events like endTurn and endPhase.
  plugins: any;
  reset: () => void;
  undo: () => void; //Function that undoes the last move.
  redo: () => void; //Function that redoes the previously undone move.
  //step: //Function that will advance the game if AI is configured.
  //log: //The game log.
  //gameID: //The game ID associated with the client.
  playerID: PlayerID; //The player ID associated with the client.
  //gameMetadata: //An object containing the players that have joined the game from a room.
}

export const GizmosBoard: React.FC<BoardProps> = (props) => {
  const { G, ctx, moves, events, plugins, playerID } = props;

  const commonAreaGridStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyItems: "center",
    alignContent: "center",
    //alignItems: "center",
    // gridTemplateRows: "33% 34% 33%",
    margin: "40px",
  };

  const styles1players = {
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "2fr 2fr 1fr",
    gridTemplateRows: "1fr 1fr",
    gridTemplateAreas: `
        "commonArea commonArea infoBar"
        "localPlayer localPlayer infoBar"`,
  };

  const energyRail = G.dispenser
    .slice(0, G.visibleEnergyBallsLimit)
    .map((energy, index) => (
      <EnergyOrb
        energyType={energy}
        key={`${index}${energy}`}
        onClick={() => moves.pickAction(index)}
        style={{ width: "150px" }}
      />
    ));

  const playerState: PlayerState = plugins.player.data.players[ctx.currentPlayer];
  console.log(plugins.player.data.players[ctx.currentPlayer]);

  return (
    <div style={styles1players}>
      <div id="commonArea" style={{ ...commonAreaGridStyle, gridArea: "commonArea" }}>
        <CardsPile cards={G.cards} moves={moves} />
        <div
          style={{
            display: "flex",
            justifySelf: "center",
            alignItems: "center",
            height: "150px",
            marginTop: "20px",
            justifyContent: "center",
          }}
        >
          {energyRail}
        </div>
      </div>
      <PlayerBar style={{ gridArea: "localPlayer" }} playerState={playerState} moves={moves} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "beige",
          gridArea: "infoBar",
          justifyContent: "stretch",
          alignItems: "end",
        }}
      >
        <CardStack>
          {playerState.researched.map((card) => (
            <Card
              key={card.cardId}
              {...card}
              OnArchiveButtonClick={() => moves.archiveFromResearchedAction(card.cardId)}
              OnBuildButtonClick={() => moves.buildFromResearchedAction(card.cardId)}
            />
          ))}
        </CardStack>

        {G.cardToBeBuiltCost && <EnergyCounter energyCount={G.cardToBeBuiltCost} />}
        <div className="flow-buttons">
          {G.cardToBeBuiltCost?.isPaid() && (
            <div
              style={{ width: "100%", background: "lime", border: "2px solid green" }}
              onClick={() => moves.confirmBuildAction()}
            >
              Confirm Build
            </div>
          )}
          {G.cardToBeBuiltCost && (
            <div
              style={{ width: "100%", background: "pink", border: "2px solid red" }}
              onClick={() => moves.cancelBuildAction()}
            >
              Cancel Build
            </div>
          )}
          {ctx.activePlayers?.[ctx.currentPlayer] === activationStage.name && (
            <div
              style={{ width: "100%", background: "lightGray", border: "2px solid gray", textAlign: "center" }}
              onClick={() => events.endTurn()}
            >
              End Turn
            </div>
          )}
          {ctx.activePlayers?.[ctx.currentPlayer] === researchStage.name && (
            <div
              style={{ width: "100%", background: "lightGray", border: "2px solid gray", textAlign: "center" }}
              onClick={() => moves.failResearchAction()}
            >
              Fail Research
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
