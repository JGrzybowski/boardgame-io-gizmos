import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { TriggerType } from "../cards/triggerType";
import { CardInfo } from "../cards/cardInfo";

export function activateCard(
  G: GameState,
  ctx: GameContext,
  cardId: number,
  additionalCardCondition?: (card: CardInfo) => boolean
): GameState | string {
  const playerState = ctx.player.get();

  const selectedCard = ctx.player?.get().findCardInMachines(cardId);
  const cardIsActive = playerState.activeCards.filter((cid) => cid === cardId);

  if (!selectedCard || !cardIsActive) return INVALID_MOVE;
  if (additionalCardCondition && !additionalCardCondition(selectedCard)) return INVALID_MOVE;
  if (!selectedCard.effect.canBeResolved(G, ctx)) return INVALID_MOVE;

  return selectedCard.effect.gameStateAfterEffect(G, ctx);
}

export const activateConverterCardAction: PlayerMove = {
  move: (G: GameState, ctx: GameContext, cardId: number, effectIndex = 0) => {
    const newGameState = activateCard(G, ctx, cardId, (card) => card?.type === TriggerType.Converter);
    return newGameState;
  },
  client: false,
  undoable: true,
};
