import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerState } from "../playerState";
import { EnergyType } from "../basicGameElements";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";

function payMove(G: GameState, ctx: GameContext, payment: EnergyType, paidFor: EnergyType): GameState | string {
  const playerState: PlayerState = ctx.player?.get();

  if (!G.cardToBeBuilt || !G.cardToBeBuiltCost) return INVALID_MOVE;

  if (!playerState.hasDeclaredEnergy(payment)) return INVALID_MOVE;
  if (G.cardToBeBuiltCost?.get(paidFor) <= 0) return INVALID_MOVE;
  if (!EnergyTypeDictionary.canPayFor(payment, paidFor)) return INVALID_MOVE;

  const newPlayerState = playerState.withRemovedEnergy(payment);
  const newGameState = G.withEnergyRemovedFromCost(paidFor);

  ctx.player?.set(newPlayerState);
  return newGameState;
}

export const payAction: PlayerMove = {
  move: payMove,
  undoable: true,
  client: false,
};
