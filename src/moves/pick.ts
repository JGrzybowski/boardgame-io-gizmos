import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerState } from "../playerState";
import { PlayerMove } from "./playerMove";
import { activationStage } from "../stages/activationStage";
import { GameContext } from "../gameContext";

function pickMove(G: GameState, ctx: GameContext, energyIndex: number): GameState | string {
  if (!G.energyWithIndexCanBeTakenFromEnergyRow(energyIndex)) return INVALID_MOVE;

  const playerState: PlayerState = ctx.player?.get();
  if (!playerState.canAddEnergy()) return INVALID_MOVE;

  // remove energy from energy row
  const [newGameState, energy] = G.withEnergyRowWithout(energyIndex);
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
