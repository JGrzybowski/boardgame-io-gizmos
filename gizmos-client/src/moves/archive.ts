import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { INVALID_MOVE } from "boardgame.io/core";

function archive(
  G: GameState,
  ctx: GameContext,
  cardId: number
): GameState | string {
  const playerState = ctx.player.get();
  if (playerState.archive.length >= playerState.archiveLimit)
    return INVALID_MOVE;

  const selectedCard = G.findCardOnTheTable(cardId);
  if (selectedCard === null) return INVALID_MOVE;

  // add card to player's archive
  let archive = playerState.archiveWith(selectedCard);
  ctx.player.set({ ...playerState, archive });

  // remove card from common area
  let cards = G.cardsWithout(cardId);
  return { ...G, cards };
}

export const archiveAction = {
  move: archive,
  undoable: false
};
