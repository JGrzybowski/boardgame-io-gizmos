import { CardEffect } from "../cards/cardEffect";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { From } from "../pickers/From";
import { RandomIndex } from "../cards/cardsCollection";
import { To } from "../putters/To";
import { PlayerState } from "../playerState";

export type TakeEnergyLimit = 1 | 2 | 3;

export class TakeEnergyEffect implements CardEffect {
  constructor(public readonly howMany: TakeEnergyLimit) {}

  canBeResolved(G: GameState, p: PlayerState): boolean {
    return p.canAddEnergy();
  }

  gameStateAfterEffect(G: GameState, ctx: GameContext): GameState {
    const playerId = ctx.playerID;
    if (!playerId) throw new Error("Player Id was not provided");
    const playerState = G.players[playerId];
    if (!playerState) throw new Error("Provided player Id is not in the game");

    const newGameState = G.moveEnergy(From.Dispenser(RandomIndex(ctx)), To.PlayerEnergyStorage(playerId));
    return newGameState;
  }
}
