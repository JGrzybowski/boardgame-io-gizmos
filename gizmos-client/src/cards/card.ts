import { GameState } from "../gameState";
import { GameContext } from "../gameContext";

export const enum TriggerType {
  Upgrade = "U",
  Converter = "C",
  Pick = "P",
  Build = "B",
  File = "F"
}

export const enum CostColor {
  Any = 0,
  Red = 1 << 0,
  Black = 1 << 1,
  Blue = 1 << 2,
  Yellow = 1 << 3
  // Any = Red | Black | Blue | Yellow
}

export type CardLevel = 0 | 1 | 2 | 3;

export abstract class Card<T extends CardEffect = any> {
  constructor(
    public readonly cardId: number,
    public readonly type: TriggerType,
    public readonly effect: T, // (G, ctx) => G
    public readonly victoryPoints: number,
    public readonly color: CostColor,
    public readonly cost: number,
    public readonly level: CardLevel
  ) {}
}

export class CardCost {
  constructor(
    public readonly R: number = 0,
    public readonly U: number = 0,
    public readonly B: number = 0,
    public readonly Y: number = 0,
    public readonly Any: number = 0
  ) {}
}

export abstract class CardEffect {
  abstract canBeResolved(G: GameState, ctx: GameContext): boolean;
  abstract gameStateAfterEffect(G: GameState, ctx: GameContext): GameState | string;
}
