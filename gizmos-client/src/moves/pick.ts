import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { INVALID_MOVE } from "boardgame.io/core";

const visibleEnergyBallsLimit = 6;

function pick(
  G: GameState,
  ctx: GameContext,
  energyIndex: number
): GameState | string {
  if (energyIndex < 0 || energyIndex > visibleEnergyBallsLimit)
    return INVALID_MOVE;

  const playerState = ctx.player.get();
  if (playerState.energyStorage.length >= playerState.energyStorageCapacity)
    return INVALID_MOVE;

  let dispenser = [...G.dispenser];
  let energy = dispenser[energyIndex];

  // add energy to player's storage
  let energyStorage = [...playerState.energyStorage];
  energyStorage.push(energy);
  ctx.player.set({ ...playerState, energyStorage });

  // remove energy from dispenser
  dispenser =
    dispenser.slice(0, energyIndex) +
    ctx.random.Shuffle(dispenser.slice(energyIndex + 1, dispenser.length));
  return { ...G, dispenser };
}

export const pickAction = {
  move: pick,
  undoable: false
};
