import { Card, CardEffect, TriggerType, CostColor, CardLevel } from "./card";

export class CardWithTakeEnergyEffect extends Card<TakeEnergyEffect> {
  constructor(
    cardId: number,
    type: TriggerType,
    howMany: TakeEnergyLimit,
    victoryPoints: number,
    color: CostColor,
    cost: number,
    level: CardLevel
  ) {
    super(
      cardId,
      type,
      new TakeEnergyEffect(howMany),
      victoryPoints,
      color,
      cost,
      level
    );
  }
}

type TakeEnergyLimit = 1 | 2 | 3;
export class TakeEnergyEffect extends CardEffect {
  canBeResolved(G: any, ctx: any): boolean {
    return ctx.player.get().CanAddEnergy();
  }
  gameStateAfterEffect(G: any, ctx: any) {
    let numberOfEnergyToSelectFrom = G.dispenser.length - 6; //TODO use const
    let takenIndex = ctx.random.Die(numberOfEnergyToSelectFrom) + 6 - 1; //TODO use const
    let dispenser = [...G.dispenser];
    dispenser =
      G.dispenser.splice(0, takenIndex) +
      G.dispenser.splice(takenIndex + 1, dispenser.length);

    return { ...G, dispenser };
  }
  constructor(public readonly howMany: TakeEnergyLimit) {
    super();
  }
}
