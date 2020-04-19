import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerState } from "../playerState";
import { activationStage } from "../stages/activationStage";

function confirmBuildMove(G: GameState, ctx: GameContext): GameState | string {
  if (!G.cardToBeBuilt || !G.cardToBeBuiltCost?.isPaid()) return INVALID_MOVE;

  //put card to player's machines
  const playerState: PlayerState = ctx.player?.get();
  const newPlayerState = playerState.withAddedCardToMachines(G.cardToBeBuilt);
  const newGameState = G.withCardToBeBuiltCleared();
  //TODO activate all cards that activate on archive trigger
  //.withCardsActivated(new TriggerCriteria("Build", selectedCard);

  ctx.player?.set(newPlayerState);
  ctx.events?.endStage?.(activationStage.name);
  return newGameState;
}

export const confirmBuildAction: PlayerMove = {
  move: confirmBuildMove,
  undoable: false,
  client: false,
};
