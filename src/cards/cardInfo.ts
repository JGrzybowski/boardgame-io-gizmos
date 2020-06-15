import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { CardEffect } from "./cardEffect";

export type CardLevel = 0 | 1 | 2 | 3;
export type CardEffectFunction = (G: GameState, ctx: GameContext) => GameState | string;

export interface CardInfo {
  readonly cardId: number;
  readonly type: TriggerType;

  readonly victoryPoints: number;
  readonly color: EnergyType;
  readonly cost: number;
  readonly level: CardLevel;

  readonly oneTimeEffect?: CardEffectFunction;
  readonly endGameEffect?: CardEffectFunction;
  readonly primaryEffect?: CardEffect;
  readonly secondaryEffect?: CardEffect;

  readonly buildTriggerCondition?: (card: CardInfo) => boolean;
  readonly pickTriggerCondition?: (energy: EnergyType) => boolean;
  readonly archiveTriggerCondition?: (card: CardInfo) => boolean;
}

export function isCardInfo(x: any): x is CardInfo {
  return "cardId" in x && "type" in x && "victoryPoints" in x && "color" in x && "cost" in x && "level" in x;
}
