import { CardInfo, CardLevel } from "./cardInfo";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { CardEffect } from "./cardEffect";
import { From } from "../pickers/From";
import { RandomIndex } from "./cardsCollection";
import { To } from "../putters/To";

type TakeEnergyLimit = 1 | 2 | 3;

export class TakeEnergyEffect extends CardEffect {
  canBeResolved(G: GameState, ctx: GameContext): boolean {
    const playerId = ctx.playerID;
    if (!playerId) return false;
    const playerState = G.players[playerId];
    if (!playerState) return false;

    return playerState.canAddEnergy();
  }

  gameStateAfterEffect(G: GameState, ctx: GameContext): GameState {
    const playerId = ctx.playerID;
    if (!playerId) throw new Error("Player Id was not provided");
    const playerState = G.players[playerId];
    if (!playerState) throw new Error("Provided player Id is not in the game");

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
