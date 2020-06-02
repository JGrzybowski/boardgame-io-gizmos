import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerState } from "../playerState";
import { PlayerMove } from "./playerMove";
import { activationStage } from "../stages/activationStage";
import { GameContext } from "../gameContext";
import { From } from "../pickers/From";
import { To } from "../putters/To";
import { RandomIndex } from "../cards/cardsCollection";

function pickMove(G: GameState, ctx: GameContext, energyIndex: number): GameState | string {
  if (energyIndex >= G.energyRow.length) return INVALID_MOVE;
  if (energyIndex < 0) return INVALID_MOVE;
  if (!ctx.playerID) return INVALID_MOVE;

  const playerState: PlayerState = G.players[ctx.playerID];
  if (!playerState.canAddEnergy()) return INVALID_MOVE;

  const newGameState = G
    // Move energy with given index to player's storage
    .moveEnergy(From.EnergyRow(energyIndex), To.PlayerEnergyStorage(ctx.playerID))
    // Add a new random energy to the energy row
    .moveEnergy(From.Dispenser(RandomIndex(ctx)), To.EnergyRow());

  //TODO activate all cards that activate on pick trigger
  //.withCardsActivated(new TriggerCriteria("Pick", energy);

  ctx.events?.setStage?.(activationStage.name);
  return newGameState;
}

export const pickAction: PlayerMove = {
  move: pickMove,
  client: false,
  undoable: false,
};
