import { GameState } from "../gameState";
import { GameContext } from "../gameContext";

const visibleEnergyBallsLimit = 6;

export function pick(
  G: GameState,
  ctx: GameContext,
  energyIndex: number
): GameState | void {
  if (energyIndex < 0 || energyIndex > visibleEnergyBallsLimit) return;

  const playerState = ctx.player.get();
  if (playerState.energyStorage.length >= playerState.energyStorageCapacity)
    return;

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
