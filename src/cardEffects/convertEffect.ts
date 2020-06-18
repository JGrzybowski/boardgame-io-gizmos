import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { INVALID_MOVE } from "boardgame.io/core";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { CardEffect } from "../cards/cardEffect";
import { PlayerState } from "../playerState";

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

  canBeResolved(G: GameState, p: PlayerState): boolean {
    if (!G.cardToBeBuiltCost) return false;
    if (G.cardToBeBuiltCost.isPaid()) return false;
    if (G.cardToBeBuiltCost.get(this.from) <= 0) return false;

    return true;
  }

  gameStateAfterEffect(G: GameState, ctx: GameContext): string | GameState {
    return ConvertEffectFunction(G, ctx, this.from, this.to);
  }
}
