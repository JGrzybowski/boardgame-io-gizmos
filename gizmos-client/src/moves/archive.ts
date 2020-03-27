import { GameState } from "../gameState";
import { GameContext } from "../gameContext";

export function archive(
  G: GameState,
  ctx: GameContext,
  cardId: number
): GameState | void {
  const playerState = ctx.player.get();
  if (playerState.archive.length < playerState.archiveLimit) {
    const selectedCard = G.findCardOnTheTable(cardId);
    if (selectedCard === null) return;

    // add card to player's archive
    let archive = playerState.archiveWith(selectedCard);
    ctx.player.set({ ...playerState, archive });

    // remove card from common area
    let cards = G.cardsWithout(cardId);
    return { ...G, cards };
  }
}
