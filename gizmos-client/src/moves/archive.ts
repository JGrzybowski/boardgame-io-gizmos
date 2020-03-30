import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { INVALID_MOVE } from "boardgame.io/core";

function archiveMove(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  const playerState = ctx.player.get();
  if (playerState.archive.length >= playerState.archiveLimit) return INVALID_MOVE;

  const selectedCard = G.findCardOnTheTable(cardId);
  if (selectedCard === null) return INVALID_MOVE;

  // add card to player's archive
  const archive = playerState.archiveWith(selectedCard);
  ctx.player.set({ ...playerState, archive });

  // remove card from common area
  const cards = G.cardsWithout(cardId);
  return { ...G, cards };
}

export const archiveAction = {
  move: archiveMove,
  undoable: false
};
