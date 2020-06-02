import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { CardEffect } from "./cardEffect";

export type CardLevel = 0 | 1 | 2 | 3;
export type CardEffectFunction = ((G: GameState, ctx: GameContext, ...data: any) => GameState | string) | null;

export abstract class CardInfo<T extends CardEffect = any> {
  protected constructor(
    public readonly cardId: number,
    public readonly type: TriggerType,
    public readonly oneTimeEffect: CardEffectFunction,
    public readonly effect: T, // (G, ctx) => G
    public readonly victoryPoints: number,
    public readonly color: EnergyType,
    public readonly cost: number,
    public readonly level: CardLevel
  ) {}
}
