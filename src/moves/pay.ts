import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerState } from "../playerState";
import { EnergyType } from "../energyType";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";

function payMove(G: GameState, ctx: GameContext, payment: EnergyType): GameState | string {
  const playerState: PlayerState = ctx.player?.get();

  if (!G.cardToBeBuilt || !G.cardToBeBuiltCost) return INVALID_MOVE;

  if (!playerState.hasDeclaredEnergy(payment)) return INVALID_MOVE;

  //jest za co płacić więc albo koszt ma kolor albo any
  const cardCost = G.cardToBeBuiltCost;
  const energyToReduce =
    cardCost?.get(payment) > 0 ? payment : cardCost?.get(EnergyType.Any) > 0 ? EnergyType.Any : null;

  if (!energyToReduce) return INVALID_MOVE;
  if (!EnergyTypeDictionary.canPayFor(payment, energyToReduce)) return INVALID_MOVE;

  const newPlayerState = playerState.withRemovedEnergy(payment);
  const newGameState = G.withEnergyRemovedFromCost(energyToReduce);

  ctx.player?.set(newPlayerState);
  return newGameState;
}

export const payAction: PlayerMove = {
  move: payMove,
  undoable: true,
  client: false,
};
