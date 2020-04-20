import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameContext } from "../gameContext";

export function activateCard(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  const selectedCard = ctx.player?.get().findCardInMachines(cardId);

  if (selectedCard === null) return INVALID_MOVE;
  if (!selectedCard.effect.canBeResolved(G, ctx)) return INVALID_MOVE;

  return selectedCard.effect.gameStateAfterEffect(G, ctx);
}
