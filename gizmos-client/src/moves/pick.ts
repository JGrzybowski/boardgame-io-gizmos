import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { Ctx } from "boardgame.io";

const visibleEnergyBallsLimit = 6;

function pick(G: GameState, ctx: Ctx, energyIndex: number): GameState | string {
  if (energyIndex < 0 || energyIndex > visibleEnergyBallsLimit) return INVALID_MOVE;

  const playerState = ctx.player?.get();
  if (playerState.energyStorage.length >= playerState.energyStorageCapacity) return INVALID_MOVE;

  const energy = G.dispenser[energyIndex];

  // add energy to player's storage
  const energyStorage = [...playerState.energyStorage, energy];
  ctx.player?.set({ ...playerState, energyStorage });

  // remove energy from dispenser
  const dispenser = G.dispenser.filter((e, idx) => idx !== energyIndex);
  return { ...G, dispenser };
}

export const pickAction = {
  move: pick,
  undoable: false
};
