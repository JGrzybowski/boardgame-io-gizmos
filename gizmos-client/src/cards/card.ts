import {GameState} from "../gameState";
import {GameContext} from "../gameContext";
import {EnergyType} from "../basicGameElements";
import {CardCost} from "./cardCost";

export const enum TriggerType {
  Upgrade = "U",
  Converter = "C",
  Pick = "P",
  Build = "B",
  File = "F"
}

export type CostColor = EnergyType | "Any";

export type CardLevel = 0 | 1 | 2 | 3;

export abstract class Card<T extends CardEffect = any> {
  protected constructor(
    public readonly cardId: number,
    public readonly type: TriggerType,
    public readonly effect: T, // (G, ctx) => G
    public readonly victoryPoints: number,
    public readonly color: CostColor,
    public readonly cost: CardCost,
    public readonly level: CardLevel
  ) {}
}

export abstract class CardEffect {
  abstract canBeResolved(G: GameState, ctx: GameContext): boolean;
  abstract gameStateAfterEffect(G: GameState, ctx: GameContext): GameState | string;
}
