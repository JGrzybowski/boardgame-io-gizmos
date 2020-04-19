import { Card, CardEffect, TriggerType, CardLevel } from "./card";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import {EnergyType} from "../basicGameElements";
import {CardCost} from "./cardCost";

type TakeEnergyLimit = 1 | 2 | 3;

const dispenserVisibilityLimit = 6;

export class TakeEnergyEffect extends CardEffect {
  canBeResolved(G: GameState, ctx: GameContext): boolean {
    return ctx.player?.get().canAddEnergy();
  }

  gameStateAfterEffect(G: GameState, ctx: GameContext): GameState {
    const numberOfEnergyToSelectFrom = G.dispenser.length - dispenserVisibilityLimit;
    const takenIndex = (ctx.random?.Die(numberOfEnergyToSelectFrom) ?? 1) + dispenserVisibilityLimit - 1;
    const dispenser = G.dispenser.filter((e, idx) => idx !== takenIndex);

    return { ...G, dispenser };
  }

  constructor(public readonly howMany: TakeEnergyLimit) {
    super();
  }
}

export class CardWithTakeEnergyEffect extends Card<TakeEnergyEffect> {
  constructor(
    cardId: number,
    type: TriggerType,
    howMany: TakeEnergyLimit,
    victoryPoints: number,
    color: EnergyType,
    cost: number,
    level: CardLevel
  ) {
    const cardCost = CardCost.fromTypeAndAmount(color, cost);
    super(cardId, type, new TakeEnergyEffect(howMany), victoryPoints, color, cardCost, level);
  }
}
