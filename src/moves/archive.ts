import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { PlayerState } from "../playerState";
import { activationStage } from "../stages/activationStage";
import { INVALID_MOVE } from "boardgame.io/core";
import { CardWithId, GetFirstOrNull } from "../cards/cardsCollection";
import { From } from "../pickers/From";
import { To } from "../putters/To";

function archiveMove(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  const playerState: PlayerState = ctx.player?.get();
  if (!playerState.canArchiveAnotherCard()) return INVALID_MOVE;

  const selectedCard = GetFirstOrNull(G.cards, CardWithId(cardId));
  if (!selectedCard) return INVALID_MOVE;

  // remove card from common area
  const newGameState = G.withCardRemovedFromTable(cardId);
  // add card to player's archive
  const newPlayerState = playerState.withAddedCardToArchive(selectedCard);
  //TODO activate all cards that activate on archive trigger
  //.withCardsActivated(new TriggerCriteria("Archive", selectedCard);

  ctx.player?.set(newPlayerState);
  ctx.events?.setStage?.(activationStage.name);
  return newGameState;
}

function archiveFromResearchedMove(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  if (!ctx.playerID) return INVALID_MOVE;
  const playerId = ctx.playerID;
  const playerState: PlayerState = G.players[playerId];
  if (!playerState.canArchiveAnotherCard()) return INVALID_MOVE;

  const selectedCard = playerState.findCardInTheResearched(cardId);
  if (!selectedCard) return INVALID_MOVE;

  const newGameState = G
    // add card to player's archive
    .moveCard(From.PlayerResearched(playerId, cardId), To.PlayerArchive(playerId))
    // move not archived cards to the bottom of deck from revealed cards
    .moveCard(From.PlayerResearched(playerId), To.BottomOfPile());

  //TODO activate all cards that activate on archive trigger
  //.withCardsActivated(new TriggerCriteria("Archive", selectedCard);

  ctx.events?.setStage?.(activationStage.name);
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
