import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { INVALID_MOVE } from "boardgame.io/core";

export function activateCard(
  G: GameState,
  ctx: GameContext,
  cardId: number
): GameState | string {
  const playerState = ctx.player.get();

  const selectedCard = playerState.findCardInMachines(cardId);
  if (selectedCard === null) return INVALID_MOVE;

  if (!selectedCard.effect.canBeResolved(G, ctx)) return INVALID_MOVE;

  let gameState = selectedCard.effect.gameStateAfterEffect(G, ctx);
  return { ...gameState };
}
