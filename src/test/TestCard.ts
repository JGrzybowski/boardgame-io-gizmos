import { CardInfo, CardLevel } from "../cards/cardInfo";
import { TriggerType } from "../cards/triggerType";
import { EnergyType } from "../energyType";

export function TestCard(cardId: number, lvl: CardLevel): CardInfo {
  return {
    cardId,
    level: lvl,
    type: TriggerType.Archive,
    color: EnergyType.Any,
    cost: 1,
    victoryPoints: 0,
  };
}

export function TestCardWithCost(cardId: number, lvl: CardLevel, color: EnergyType, cost: number): CardInfo {
  return {
    cardId,
    level: lvl,
    type: TriggerType.Archive,
    color: color,
    cost: cost,
    victoryPoints: 0,
  };
}
