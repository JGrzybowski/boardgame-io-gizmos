import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { Ctx } from "boardgame.io";
import {PlayerState} from "../playerState";
import {PlayerMove} from "./playerMove";

function pickMove(G: GameState, ctx: Ctx, energyIndex: number): GameState | string {
  if (!G.energyWithIndexCanBeTakenFromEnergyRow(energyIndex)) return INVALID_MOVE;

  const playerState: PlayerState = ctx.player?.get();
  if (!playerState.canAddEnergy()) return INVALID_MOVE;

  // remove energy from dispenser
  const [newGameState, energy] = G.withDispenserWithout(energyIndex);
  // add energy to player's storage
  const newPlayerState = playerState.withAddedEnergy(energy);
  //TODO activate all cards that activate on pick trigger
  //.withCardsActivated(new TriggerCriteria("Pick", energy);

  ctx.player?.set(newPlayerState);
  return newGameState;
}

export const pickAction: PlayerMove= {
  move: pickMove,
  client: false,
  undoable: false
};
