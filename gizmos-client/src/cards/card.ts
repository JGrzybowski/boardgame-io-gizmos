import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { EnergyType } from "../basicGameElements";

export enum TriggerType {
  Upgrade = "U",
  Converter = "C",
  Pick = "P",
  Build = "B",
  Archive = "A",
}

export type CardLevel = 0 | 1 | 2 | 3;

export abstract class CardInfo<T extends CardEffect = any> {
  protected constructor(
    public readonly cardId: number,
    public readonly type: TriggerType,
    public readonly effect: T, // (G, ctx) => G
    public readonly victoryPoints: number,
    public readonly color: EnergyType,
    public readonly cost: number,
    public readonly level: CardLevel
  ) {}
}

export abstract class CardEffect {
  abstract canBeResolved(G: GameState, ctx: GameContext): boolean;
  abstract gameStateAfterEffect(G: GameState, ctx: GameContext): GameState | string;
}
