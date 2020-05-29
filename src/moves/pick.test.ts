import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerState } from "../playerState";
import { PlayerMove } from "./playerMove";
import { activationStage } from "../stages/activationStage";
import { GameContext } from "../gameContext";

function pickMove(
  G: GameState,
  ctx: GameContext,
  energyIndex: number
): GameState | string {
  if (!G.energyWithIndexCanBeTakenFromEnergyRow(energyIndex))
    return INVALID_MOVE;

  const playerState: PlayerState = ctx.player?.get();
  if (!playerState.canAddEnergy()) return INVALID_MOVE;

  // remove energy from dispenser
  const [newGameState, energy] = G.withDispenserWithout(energyIndex);
  // add energy to player's storage
  const newPlayerState = playerState.withAddedEnergy(energy);
  //TODO activate all cards that activate on pick trigger
  //.withCardsActivated(new TriggerCriteria("Pick", energy);

  ctx.player?.set(newPlayerState);
  ctx.events?.setStage?.(activationStage.name);
  return newGameState;
}

export const pickAction: PlayerMove = {
  move: pickMove,
  client: false,
  undoable: false,
};

test.todo("Adds energy to player's storage");
test.todo("Removes energy of given index from the dispenser");
test.todo("Adds new energy at the end of dispenser");

test.todo("can be undone");
test.todo("Returns invalid move if index is out of range");
test.todo("Returns invalid move if player has no space in the energy storage");
test.todo("Moves to activation stage");
