import { CardInfo, CardLevel } from "./cardInfo";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { CardEffect } from "./cardEffect";

type TakeEnergyLimit = 1 | 2 | 3;

const energyRowVisibilityLimit = 6;

export class TakeEnergyEffect extends CardEffect {
  canBeResolved(G: GameState, ctx: GameContext): boolean {
    return ctx.player?.get().canAddEnergy();
  }

  gameStateAfterEffect(G: GameState, ctx: GameContext): GameState {
    // TODO change to G.WithoutRandomEnergy(): [GameState, EnergyType]
    const numberOfEnergyToSelectFrom = G.energyRow.length - energyRowVisibilityLimit;
    const takenIndex = (ctx.random?.Die(numberOfEnergyToSelectFrom) ?? 1) + energyRowVisibilityLimit - 1;
    const energyRow = G.energyRow.filter((e, idx) => idx !== takenIndex);
    return { ...G, energyRow };
  }

  constructor(public readonly howMany: TakeEnergyLimit) {
    super();
  }
}

export class CardWithTakeEnergyEffect extends CardInfo<TakeEnergyEffect> {
  constructor(
    cardId: number,
    type: TriggerType,
    howMany: TakeEnergyLimit,
    victoryPoints: number,
    color: EnergyType,
    cost: number,
    level: CardLevel
  ) {
    super(cardId, type, null, new TakeEnergyEffect(howMany), victoryPoints, color, cost, level);
  }
}
