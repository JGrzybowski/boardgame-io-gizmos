import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { TriggerType } from "../cards/triggerType";
import { CardInfo } from "../cards/cardInfo";
import { EnergyType } from "../basicGameElements";

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

export function getActiveCard<T extends CardInfo>(
  G: GameState,
  ctx: GameContext,
  cardId: number,
  additionalCardCondition?: (card: CardInfo) => boolean
): T | null {
  const playerState = ctx.player.get();
  const selectedCard = playerState.findCardInMachines(cardId);
  const cardIsActive = playerState.activeCards.filter((cid) => cid === cardId);

  if (!selectedCard || !cardIsActive) return null;
  if (additionalCardCondition && !additionalCardCondition(selectedCard)) return null;
  if (!selectedCard.effect.canBeResolved(G, ctx)) return null;

  return selectedCard as T;
}

export const activateConverterCardAction: PlayerMove = {
  move: (G: GameState, ctx: GameContext, from: EnergyType, to: EnergyType, cardId: number) => {
    const newGameState = activateCard(G, ctx, cardId, (card) => card?.type === TriggerType.Converter);
    const newPlayerState = ctx.player.get().withUsedCard(cardId);
    ctx.player.set(newPlayerState);
    return newGameState;
  },
  client: true,
  undoable: true,
  redact: true,
};