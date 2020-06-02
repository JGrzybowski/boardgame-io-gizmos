import { CardInfo, CardEffectFunction, CardLevel } from "./cardInfo";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { GameContext } from "../gameContext";
import { GameState } from "../gameState";

export class UpgradeEffectCard extends CardInfo<any> {
  constructor(
    cardId: number,
    oneTimeEffect: CardEffectFunction | null,
    victoryPoints: number,
    color: EnergyType,
    cost: number,
    level: CardLevel
  ) {
    super(cardId, TriggerType.Upgrade, oneTimeEffect, null, victoryPoints, color, cost, level);
  }
}

export function UpgradeEffectFunction(
  G: GameState,
  Ctx: GameContext,
  storage = 0,
  archive = 0,
  research = 0
): GameState {
  const playerState = Ctx.player.get().withLimitsChangedBy(storage, archive, research);
  Ctx.player.set(playerState);

  return G;
}
