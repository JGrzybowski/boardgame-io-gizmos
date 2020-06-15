import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { GameContext } from "../gameContext";
import { GameState } from "../gameState";
import { EnergyTypeDictionary } from "./energyTypeDictionary";
import { CardInfo, CardLevel } from "./cardInfo";
import { INVALID_MOVE } from "boardgame.io/core";
import { CardEffect } from "./cardEffect";

export function ConvertEffectCard(
  cardId: number,
  victoryPoints: number,
  color: EnergyType,
  cost: number,
  level: CardLevel,
  effect1: ConvertEffect,
  effect2?: ConvertEffect
): CardInfo {
  return {
    cardId,
    type: TriggerType.Converter,
    primaryEffect: effect1,
    secondaryEffect: effect2,
    victoryPoints,
    color,
    cost,
    level,
  };
}

export function ConvertEffectFunction(
  G: GameState,
  Ctx: GameContext,
  from: EnergyType,
  to: EnergyType
): GameState | string {
  if (!G.cardToBeBuiltCost) return INVALID_MOVE;

  const costChange = new EnergyTypeDictionary()
    .withAmountToPayWithEnergyTypeSetTo(from, -1)
    .withAmountToPayWithEnergyTypeSetTo(to, 1);
  const cardToBeBuiltCost = G.cardToBeBuiltCost?.add(costChange);
  const newGameState = { ...G, cardToBeBuiltCost };

  return newGameState;
}

export class ConvertEffect implements CardEffect {
  constructor(public readonly from: EnergyType, public readonly to: EnergyType) {}

  canBeResolved(G: GameState, ctx: GameContext): boolean {
    if (!G.cardToBeBuiltCost) return false;
    if (G.cardToBeBuiltCost.isPaid()) return false;
    if (G.cardToBeBuiltCost.get(this.from) <= 0) return false;
    return true;
  }

  gameStateAfterEffect(G: GameState, ctx: GameContext): string | GameState {
    return ConvertEffectFunction(G, ctx, this.from, this.to);
  }
}
