import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { PlayerState } from "../playerState";
import { activationStage } from "../stages/activationStage";
import { INVALID_MOVE } from "boardgame.io/core";

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
  ctx.events?.endStage?.(activationStage.name);
  return newGameState;
}

function archiveFromResearchedMove(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  const playerState: PlayerState = ctx.player?.get();
  if (!playerState.canArchiveAnotherCard()) return INVALID_MOVE;

  const selectedCard = playerState.findCardInTheResearched(cardId);
  if (!selectedCard) return INVALID_MOVE;

  // move not archived cards to the bottom of deck from revealed cards
  const newGameState = G.withCardsPutOnBottom(playerState.researchedWithout(cardId));
  // add card to player's archive
  const newPlayerState: PlayerState = playerState.withAddedCardToArchive(selectedCard).withResearchedCleared();
  //TODO activate all cards that activate on archive trigger
  //.withCardsActivated(new TriggerCriteria("Archive", selectedCard);

  ctx.player?.set(newPlayerState);
  ctx.events?.endStage?.(activationStage.name);
  return newGameState;
}

export const archiveAction: PlayerMove = {
  move: archiveMove,
  client: false,
  undoable: false,
};

export const archiveFromResearchedAction: PlayerMove = {
  move: archiveFromResearchedMove,
  client: false,
  undoable: false,
};
