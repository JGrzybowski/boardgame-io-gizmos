import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { INVALID_MOVE } from "boardgame.io/core";
import { EnergyType } from "../energyType";
import { From } from "../pickers/From";
import { To } from "../putters/To";

function payMove(G: GameState, ctx: GameContext, payment: EnergyType): GameState | string {
  if (payment === EnergyType.Any) return INVALID_MOVE;
  if (!ctx.playerID) return INVALID_MOVE;
  const playerId = ctx.playerID;

  const cardCost = G.cardToBeBuiltCost;
  if (!cardCost) return INVALID_MOVE;

  const energyToReduce =
    cardCost?.get(payment) > 0 ? payment : cardCost?.get(EnergyType.Any) > 0 ? EnergyType.Any : null;
  if (!energyToReduce) return INVALID_MOVE;

  if (!G.canMoveEnergy(From.PlayerEnergyStorage(playerId, payment), To.Dispenser())) return INVALID_MOVE;
  const newGameState = G
    // move players energy to dispenser
    .moveEnergy(From.PlayerEnergyStorage(playerId, payment), To.Dispenser())
    // TODO: Replace with something like Copy.To? or addtional To.CardToBeBuildCost
    // reduce the cost
    .withEnergyRemovedFromCost(energyToReduce);

  return newGameState;
}

export const payAction: PlayerMove = {
  move: payMove,
  undoable: true,
  client: false,
};
