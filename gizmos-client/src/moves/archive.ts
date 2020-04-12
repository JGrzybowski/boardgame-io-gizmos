import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerMove } from "./playerMove";
import {PlayerState} from "../playerState";
import {activationsStage} from "../stages/gameStages";

function archiveMove(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  const playerState: PlayerState = ctx.player?.get();
  if (!playerState.canArchiveAnotherCard()) return INVALID_MOVE;

  const selectedCard = G.findCardOnTheTable(cardId);
  if (!selectedCard) return INVALID_MOVE;

  // remove card from common area
  const newGameState = G.withCardRemovedFromTable(cardId);
  // add card to player's archive
  const newPlayerState = playerState.withAddedCardToArchive(selectedCard);
  //TODO activate all cards that activate on archive trigger
  //.withCardsActivated(new TriggerCriteria("Archive", selectedCard);

  ctx.player?.set(newPlayerState);
  ctx.events?.endPhase?.(activationsStage.name);
  return newGameState;
}

export const archiveAction: PlayerMove = {
  move: archiveMove,
  client: false,
  undoable: false
};
