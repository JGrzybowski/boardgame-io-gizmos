import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { INVALID_MOVE } from "boardgame.io/core";

function cancelBuildMove(G: GameState, ctx: GameContext): GameState | string {
  if (!G.previousStageName || !G.gameStateBeforeBuild) return INVALID_MOVE;
  const oldGameState = G.gameStateBeforeBuild;
  ctx.events?.setStage?.(G.previousStageName);
  return oldGameState;
}

export const cancelBuildAction: PlayerMove = {
  move: cancelBuildMove,
  client: false,
  undoable: false,
};
