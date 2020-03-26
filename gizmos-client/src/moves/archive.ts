import { GameState } from "../gameState";
import { GameContext } from "../gameContext";

export function archive(
  G: GameState,
  ctx: GameContext,
  cardId: number
): GameState | void {
  const playerState = ctx.player.get();
  if (playerState.archive.length < playerState.archiveLimit) {
    let cards = [...G.cards];
    const selectedCard = cards.find(c => c.cardId === cardId);

    if (typeof selectedCard === "undefined") return;

    // add card to player's archive
    let archive = [...playerState.archive];
    archive.push(selectedCard);
    ctx.player.set({ ...playerState, archive });

    // remove card from common area
    cards = cards.filter(c => c.cardId !== cardId);
    return { ...G, cards };
  }
}
