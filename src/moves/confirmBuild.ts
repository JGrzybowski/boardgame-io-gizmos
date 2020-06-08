import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerState } from "../playerState";
import { activationStage } from "../stages/activationStage";
import { From } from "../pickers/From";
import { To } from "../putters/To";

function confirmBuildMove(G: GameState, ctx: GameContext): GameState | string {
  if (!G.cardToBeBuilt || !G.cardToBeBuiltCost?.isPaid()) return INVALID_MOVE;
  if (!ctx.playerID) return INVALID_MOVE;
  const playerId = ctx.playerID;
  const playerState: PlayerState = G.players[playerId];
  if (!playerState) return INVALID_MOVE;

  const cardToBuild = G.cardToBeBuilt;
  if (cardToBuild.level === 0) return INVALID_MOVE;
  //move built card to player's machines
  let newGameState = G.moveCard(From.CardToBuild(), To.PlayerCards(ctx.playerID));

  if (newGameState.visibleCardsOfLevel(cardToBuild.level).length < newGameState.visibleCardsLimits[cardToBuild.level])
    newGameState = newGameState.moveCard(From.TopOfPile(cardToBuild.level, 1), To.VisibleCards());
  //TODO activate all cards that activate on archive trigger
  //.withCardsActivated(new TriggerCriteria("Build", selectedCard);

  ctx.events?.setStage?.(activationStage.name);
  if (G.cardToBeBuilt.oneTimeEffect) return G.cardToBeBuilt.oneTimeEffect(newGameState, ctx);
  return newGameState;
}

export const confirmBuildAction: PlayerMove = {
  move: confirmBuildMove,
  undoable: false,
  client: false,
};
